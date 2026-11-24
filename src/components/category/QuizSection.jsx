import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Award,
  ArrowRight,
  Shuffle,
  Sparkles,
  Layers,
  CheckSquare
} from 'lucide-react';
import Button from '../common/Button';
import { staticCategoryQuizzes } from '../../data/staticCategoriesData';

const QUESTIONS_PER_SET = 5;

/**
 * Pick 5 random questions from a pool
 */
function pickRandomSubset(pool, excludeIds = []) {
  if (!pool || pool.length === 0) return [];
  if (pool.length <= QUESTIONS_PER_SET) return pool;

  const remaining = pool.filter((q) => !excludeIds.includes(q.id));
  const shuffledRemaining = [...remaining].sort(() => 0.5 - Math.random());

  if (shuffledRemaining.length >= QUESTIONS_PER_SET) {
    return shuffledRemaining.slice(0, QUESTIONS_PER_SET);
  }

  const needed = QUESTIONS_PER_SET - shuffledRemaining.length;
  const previousPool = pool.filter((q) => excludeIds.includes(q.id));
  const shuffledPrevious = [...previousPool].sort(() => 0.5 - Math.random());

  return [...shuffledRemaining, ...shuffledPrevious.slice(0, needed)];
}

export function QuizSection({ questions = [], categoryId, categoryTitle }) {
  const { t } = useTranslation();
  const [selectedQuizTab, setSelectedQuizTab] = useState('quiz-1'); // 'quiz-1' | 'quiz-2' | 'quiz-3' | 'random'
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Helper to extract questions for a selected tab
  const getQuestionsForTab = (tab, pool) => {
    if (!pool || pool.length === 0) return [];
    if (tab === 'quiz-1') {
      return pool.slice(0, 5);
    }
    if (tab === 'quiz-2') {
      return pool.slice(5, 10).length >= 5 ? pool.slice(5, 10) : pool.slice(0, 5);
    }
    if (tab === 'quiz-3') {
      return pool.slice(10, 15).length >= 5 ? pool.slice(10, 15) : pool.slice(5, 10);
    }
    // Random mode
    return pickRandomSubset(pool, []);
  };

  // Sync active questions when pool or category changes
  useEffect(() => {
    if (!questions || questions.length === 0) {
      setActiveQuestions([]);
      setSelectedAnswers({});
      setQuizResult(null);
      return;
    }

    const setQs = getQuestionsForTab(selectedQuizTab, questions);
    setActiveQuestions(setQs);
    setSelectedAnswers({});
    setQuizResult(null);
    setError(null);
  }, [questions, categoryId]);

  // Tab change handler
  const handleSelectTab = (tab) => {
    if (tab === selectedQuizTab && tab !== 'random') return;
    setSelectedQuizTab(tab);
    const setQs = getQuestionsForTab(tab, questions);
    setActiveQuestions(setQs);
    setSelectedAnswers({});
    setQuizResult(null);
    setError(null);
  };

  // Refresher button handler (loads a fresh random set or next set)
  const handleRefreshNewSet = () => {
    if (selectedQuizTab === 'quiz-1') {
      handleSelectTab('quiz-2');
    } else if (selectedQuizTab === 'quiz-2') {
      handleSelectTab('quiz-3');
    } else if (selectedQuizTab === 'quiz-3') {
      handleSelectTab('random');
    } else {
      // Re-shuffle random set
      const currentIds = activeQuestions.map((q) => q.id);
      const freshSet = pickRandomSubset(questions, currentIds);
      setActiveQuestions(freshSet);
      setSelectedAnswers({});
      setQuizResult(null);
      setError(null);
    }

    const quizElem = document.getElementById('sec-quiz');
    if (quizElem) {
      quizElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
        <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-600 dark:text-slate-400">
          {t('quiz.no_questions', 'No quiz questions currently available for this category.')}
        </p>
      </div>
    );
  }

  const handleSelectOption = (questionId, optionIndex) => {
    if (quizResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < activeQuestions.length) {
      alert(
        t('quiz.please_answer_all', 'Please answer all {{count}} questions before submitting.', {
          count: activeQuestions.length
        })
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Reliable client-side evaluation with static quiz fallback for correct_index
    const results = activeQuestions.map((q) => {
      let correctIdx = q.correct_index;

      // If correct_index is undefined, look up in staticCategoryQuizzes
      if (!Number.isInteger(correctIdx)) {
        for (const catKey of Object.keys(staticCategoryQuizzes)) {
          const match = staticCategoryQuizzes[catKey].find((item) => item.id === q.id);
          if (match && Number.isInteger(match.correct_index)) {
            correctIdx = match.correct_index;
            break;
          }
        }
      }

      if (!Number.isInteger(correctIdx)) {
        correctIdx = 0; // ultimate fallback
      }

      const selectedIndex = selectedAnswers[q.id];
      const isCorrect = selectedIndex === correctIdx;

      return {
        question_id: q.id,
        selected_index: selectedIndex,
        correct_index: correctIdx,
        is_correct: isCorrect,
        explanation: q.explanation
      };
    });

    const score = results.filter((r) => r.is_correct).length;
    const percentage = Math.round((score / activeQuestions.length) * 100);
    const passed = percentage >= 60;

    setQuizResult({
      score,
      total: activeQuestions.length,
      percentage,
      passed,
      results
    });

    if (passed) {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 }
      });
    }

    setIsSubmitting(false);

    // Attempt background save to backend if server is accessible
    try {
      fetch(`/api/v1/quiz/${categoryId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(selectedAnswers).map(([qId, sIdx]) => ({
            question_id: qId,
            selected_index: sIdx
          }))
        })
      }).catch(() => {});
    } catch (err) {
      // Ignored non-blocking persistence
    }
  };

  const handleRetakeSame = () => {
    setSelectedAnswers({});
    setQuizResult(null);
    setError(null);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isSubmitted = !!quizResult;
  const totalInBank = questions.length;

  return (
    <div className="p-6 sm:p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] shadow-sm">
      {/* Quiz Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {t('quiz.badge', 'Interactive Knowledge Assessment')}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              {t('quiz.question_set_badge', '5 Questions Set')}
            </span>
            {totalInBank > 5 && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ({t('quiz.bank_size', { total: totalInBank, defaultValue: `Total Bank: ${totalInBank} Questions (3 Sets)` })})
              </span>
            )}
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {categoryTitle} {t('quiz.title_suffix', 'Knowledge Quiz')}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t(
              'quiz.instruction',
              'Choose between Quiz 1st, Quiz 2nd, and Quiz 3rd below. Each set features 5 distinct questions covering definitions, assistive technologies, and the RPwD Act 2016.'
            )}
          </p>
        </div>

        {/* Top Actions & Score / Progress Badge */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRefreshNewSet}
            disabled={isSubmitting}
            title={t('quiz.refresh_desc', 'Refresh or switch to another question set')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{t('quiz.refresh_set', '🔄 Refresh Question Set')}</span>
          </button>

          {!quizResult ? (
            <div className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-sm font-bold border border-blue-200 dark:border-blue-800">
              {t('quiz.question_of', 'Question {{current}} of {{total}}', {
                current: answeredCount,
                total: activeQuestions.length
              })}
            </div>
          ) : (
            <div
              className={`px-5 py-2.5 rounded-2xl flex items-center gap-3 border-2 ${
                quizResult.passed
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-200'
                  : 'bg-amber-50 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-200'
              }`}
            >
              <Award className="w-6 h-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block">
                  {quizResult.passed ? t('quiz.passed_title', 'Passed!') : t('quiz.score_title', 'Score')}
                </span>
                <span className="text-xl font-extrabold">
                  {quizResult.score} / {quizResult.total} ({quizResult.percentage}%)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Set Selection Tabs: Quiz 1st, Quiz 2nd, Quiz 3rd, Random */}
      <div className="mt-6 flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => handleSelectTab('quiz-1')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all touch-target cursor-pointer ${
            selectedQuizTab === 'quiz-1'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          aria-pressed={selectedQuizTab === 'quiz-1'}
        >
          <CheckSquare className="w-4 h-4" />
          <span>1. Quiz 1st (Q1–Q5)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('quiz-2')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all touch-target cursor-pointer ${
            selectedQuizTab === 'quiz-2'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          aria-pressed={selectedQuizTab === 'quiz-2'}
        >
          <CheckSquare className="w-4 h-4" />
          <span>2. Quiz 2nd (Q6–Q10)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('quiz-3')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all touch-target cursor-pointer ${
            selectedQuizTab === 'quiz-3'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          aria-pressed={selectedQuizTab === 'quiz-3'}
        >
          <CheckSquare className="w-4 h-4" />
          <span>3. Quiz 3rd (Q11–Q15)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('random')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all touch-target cursor-pointer sm:ml-auto ${
            selectedQuizTab === 'random'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          aria-pressed={selectedQuizTab === 'random'}
        >
          <Shuffle className="w-4 h-4" />
          <span>🔀 Random Set</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="my-4 p-4 rounded-xl bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200 border border-red-300 dark:border-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Result Message Banner */}
      {isSubmitted && (
        <div
          className={`mt-6 p-4 rounded-xl border text-sm font-medium flex items-center justify-between flex-wrap gap-3 ${
            quizResult.passed
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800'
          }`}
        >
          <span>
            {quizResult.passed
              ? t(
                  'quiz.passed',
                  'Outstanding! You have demonstrated a solid understanding of these accessibility concepts.'
                )
              : t(
                  'quiz.keep_learning',
                  'Good effort! Review the explanations below and try another question set to strengthen your knowledge.'
                )}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefreshNewSet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 font-bold text-xs text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer transition-colors shadow-xs"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Next Quiz Set</span>
            </button>
          </div>
        </div>
      )}

      {/* Question Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {activeQuestions.map((q, qIndex) => {
          const evalResult = quizResult?.results?.find((r) => r.question_id === q.id);

          return (
            <fieldset
              key={q.id}
              className={`p-5 sm:p-6 rounded-2xl border-2 transition-all ${
                isSubmitted
                  ? evalResult?.is_correct
                    ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-red-400 bg-red-50/40 dark:bg-red-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <legend className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-4 px-2">
                <span className="text-blue-600 dark:text-blue-400 mr-2">Q{qIndex + 1}.</span>
                {q.question}
              </legend>

              <div className="space-y-3" role="radiogroup" aria-label={`Question ${qIndex + 1}`}>
                {q.options.map((optionText, optIndex) => {
                  const isSelected = selectedAnswers[q.id] === optIndex;
                  const isCorrectChoice = isSubmitted && evalResult?.correct_index === optIndex;
                  const isWrongChoice = isSubmitted && isSelected && !evalResult?.is_correct;

                  let optionStyles =
                    'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750';

                  if (isSelected && !isSubmitted) {
                    optionStyles =
                      'border-blue-600 bg-blue-50/80 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-300 font-semibold';
                  } else if (isCorrectChoice) {
                    optionStyles =
                      'border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 font-bold ring-2 ring-emerald-400';
                  } else if (isWrongChoice) {
                    optionStyles =
                      'border-red-500 bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100 font-bold';
                  }

                  return (
                    <label
                      key={optIndex}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all touch-target ${optionStyles}`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={optIndex}
                        checked={isSelected}
                        disabled={isSubmitted}
                        onChange={() => handleSelectOption(q.id, optIndex)}
                        className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 shrink-0"
                      />
                      <span className="text-base flex-1">{optionText}</span>

                      {isCorrectChoice && (
                        <CheckCircle
                          className="w-5 h-5 text-emerald-600 shrink-0"
                          aria-label="Correct Answer"
                        />
                      )}
                      {isWrongChoice && (
                        <XCircle
                          className="w-5 h-5 text-red-600 shrink-0"
                          aria-label="Incorrect selection"
                        />
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Instant Explanation Feedback */}
              {isSubmitted && evalResult && (
                <div
                  className={`mt-4 p-4 rounded-xl text-sm leading-relaxed border ${
                    evalResult.is_correct
                      ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                      : 'bg-red-100/70 border-red-300 text-red-900 dark:bg-red-950 dark:text-red-200'
                  }`}
                >
                  <span className="font-bold block mb-1">
                    {evalResult.is_correct
                      ? `✓ ${t('quiz.correct', 'Correct!')}`
                      : `✗ ${t('quiz.explanation', 'Explanation:')}`}
                  </span>
                  {q.explanation || evalResult.explanation}
                </div>
              )}
            </fieldset>
          );
        })}

        {/* Action Controls */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {!quizResult ? (
              <>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting || answeredCount < activeQuestions.length}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {isSubmitting
                    ? t('quiz.submitting', 'Evaluating...')
                    : `${t('quiz.submit', 'Submit Answers')} (${answeredCount}/${activeQuestions.length})`}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleRefreshNewSet}
                  icon={Shuffle}
                >
                  {t('quiz.refresh_set', '🔄 Refresh Question Set')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleRetakeSame}
                  icon={RotateCcw}
                >
                  {t('quiz.retake', 'Retry Current Quiz')}
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleRefreshNewSet}
                  icon={Shuffle}
                >
                  {t('quiz.refresh_set', '🔄 Next / Refresh Set')}
                </Button>
              </>
            )}
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('common.verified_sources', 'Verified Sources')} • RPwD Act 2016 • WCAG 2.2
          </span>
        </div>
      </form>
    </div>
  );
}

export default QuizSection;

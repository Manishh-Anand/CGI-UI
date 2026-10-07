import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  ArrowRight,
  BookOpen,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ASSESSMENT_QUESTIONS } from '../../data/mockData';
import { HelpButton } from '../ui/PageChrome';

export const AssessmentsView: React.FC = () => {
  const { navigateTo, openAiSearch } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<
    { questionId: string; selected: number; correct: boolean }[]
  >([]);

  const question = ASSESSMENT_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    const isCorrect = selectedOption === question.correctIndex;
    if (isCorrect) setScoreCount(prev => prev + 1);

    setAnswersHistory(prev => [
      ...prev,
      { questionId: question.id, selected: selectedOption, correct: isCorrect }
    ]);
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScoreCount(0);
    setAnswersHistory([]);
  };

  const isCompleted =
    isAnswerSubmitted && currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Knowledge Verification
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            e-Discovery Operational Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Demonstrate your understanding of EDRM lifecycle stages, single-service churn risks,
            and competitive differentiators.
          </p>
        </div>

        <div className="flex items-center gap-2"><HelpButton title="How assessments work" body="Use the numbered navigator to move between questions, submit each response, and review explanations. Your final score highlights the Atlas topics to revisit." /><button
          onClick={handleRestart}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 self-start sm:self-auto py-1 px-2 rounded hover:bg-slate-100"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Assessment</span>
        </button></div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric label="Questions" value={`${ASSESSMENT_QUESTIONS.length}`} /><Metric label="Categories" value={`${new Set(ASSESSMENT_QUESTIONS.map(item => item.area)).size}`} /><Metric label="Answered" value={`${answersHistory.length}`} /><Metric label="Current accuracy" value={`${answersHistory.length ? Math.round((scoreCount / answersHistory.length) * 100) : 0}%`} /></div>

      {/* Progress Bar & Score Counter */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
        <div className="space-y-1 flex-1 max-w-xs mr-4">
          <div className="flex justify-between text-slate-600 font-semibold text-[11px]">
            <span>
              Question {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}
            </span>
            <span>{Math.round(((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100}%`
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">
              Current Score
            </div>
            <div className="text-sm font-bold text-slate-900 tabular-nums">
              {scoreCount} / {ASSESSMENT_QUESTIONS.length} Correct
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><span className="mr-2 self-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Question map</span>{ASSESSMENT_QUESTIONS.map((item, index) => { const answer = answersHistory.find(entry => entry.questionId === item.id); return <button key={item.id} onClick={() => { setCurrentQuestionIndex(index); setSelectedOption(answer?.selected ?? null); setIsAnswerSubmitted(Boolean(answer)); }} className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition ${index === currentQuestionIndex ? 'bg-blue-950 text-white' : answer?.correct ? 'bg-emerald-50 text-emerald-800' : answer ? 'bg-rose-50 text-rose-800' : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-900'}`}>{index + 1}</button>; })}</div>

      {/* Main Question Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-2">
            <span>{question.area}</span>
            <span>·</span>
            <span className="text-slate-500 font-normal">{question.moduleTitle}</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {question.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === question.correctIndex;

            let optionClasses =
              'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-800';

            if (isSelected && !isAnswerSubmitted) {
              optionClasses = 'border-blue-600 bg-blue-50/60 text-blue-900 ring-1 ring-blue-600';
            }

            if (isAnswerSubmitted) {
              if (isCorrectOption) {
                optionClasses =
                  'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrectOption) {
                optionClasses = 'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400';
              } else {
                optionClasses = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-70';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswerSubmitted}
                className={`w-full text-left p-3.5 rounded-lg transition-all text-xs sm:text-sm flex items-start gap-3 ${optionClasses}`}
              >
                <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed">{option}</span>
                {isAnswerSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrectOption && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit or Next Controls */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {!isAnswerSubmitted
              ? 'Select the best answer and click Submit to check rationale'
              : selectedOption === question.correctIndex
              ? 'Correct answer!'
              : 'Incorrect answer.'}
          </div>

          <div className="flex items-center gap-3">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  selectedOption !== null
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            ) : !isCompleted ? (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Next Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Complete Assessment ({scoreCount}/{ASSESSMENT_QUESTIONS.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Explanation and Learning Link when Answer is Submitted */}
        {isAnswerSubmitted && (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in duration-150">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Explanation & Grounding Reference</span>
            </div>
            <p className="text-slate-700 leading-relaxed">{question.explanation}</p>
            <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1">
              <span>Related documentation:</span>
              <strong className="text-blue-700">{question.relatedDoc}</strong>
            </div>
          </div>
        )}
      </div>
      {isCompleted && <div className="midnight-panel p-6"><div className="section-kicker section-kicker-light">Recommended next move</div><h2 className="mt-2 text-2xl font-semibold text-white">Turn misses into <em>momentum.</em></h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">Review the topics you missed, then continue in Atlas with targeted learning before you retake the assessment.</p><div className="mt-5 flex flex-wrap gap-2"><button className="button-light" onClick={() => window.open('https://atlas.consilio.com', '_blank', 'noopener,noreferrer')}>Open recommended Atlas learning <ArrowRight className="h-3.5 w-3.5" /></button><button className="button-ghost !border-white/40 !text-white" onClick={handleRestart}>Retake assessment</button></div></div>}
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => <div className="premium-card p-4"><div className="text-2xl font-semibold text-slate-950">{value}</div><div className="mt-1 text-xs font-semibold text-slate-600">{label}</div></div>;

"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Send } from "lucide-react";
import { logicGatesPretest, type PretestDifficulty } from "@/lib/logic-gates-pretest";
import { getProgressSnapshot, updateProgress, type ExperimentProgress } from "@/lib/progress";

const levels: PretestDifficulty[] = ["Easy", "Medium", "Hard", "Advanced"];

export function LogicGatesPretest({ experimentSlug }: { experimentSlug: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState<boolean | null>(null);
  const question = logicGatesPretest[currentIndex];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const score = useMemo(() => logicGatesPretest.reduce((total, item) => total + (answers[item.id] === item.answerIndex ? 1 : 0), 0), [answers]);
  const percent = Math.round((answeredCount / logicGatesPretest.length) * 100);
  const unansweredCount = logicGatesPretest.length - answeredCount;

  function submitTest() {
    const now = new Date().toISOString();
    const currentProgress = getProgressSnapshot();
    const previous: ExperimentProgress = currentProgress[experimentSlug] ?? {
      preTestScore: null,
      postTestScore: null,
      completedAt: null,
      updatedAt: now,
    };
    const nextProgress = {
      ...currentProgress,
      [experimentSlug]: { ...previous, preTestScore: Math.round((score / logicGatesPretest.length) * 100), updatedAt: now },
    };
    setSaved(updateProgress(nextProgress));
    setSubmitted(true);
  }

  function restartTest() {
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setSaved(null);
  }

  if (submitted) {
    const rating = score >= 18 ? "Excellent start" : score >= 15 ? "Strong foundation" : score >= 10 ? "Keep building" : "Review the fundamentals";
    return (
      <section className="pretest" aria-labelledby="pretest-results-title">
        <div className="pretest-results">
          <span className="eyebrow">THEORY TEST · RESULTS</span>
          <div className="pretest-results__score"><strong>{score}<small> / {logicGatesPretest.length}</small></strong><span>{Math.round((score / logicGatesPretest.length) * 100)}% score</span></div>
          <h3 id="pretest-results-title">{rating}</h3>
          <p>You earned one mark for each correct answer. Unanswered questions counted as zero. Review the answers below, then retake the test if you want another attempt.</p>
          <div className="pretest-results__levels">
            {levels.map((level) => {
              const levelQuestions = logicGatesPretest.filter((item) => item.difficulty === level);
              const levelScore = levelQuestions.filter((item) => answers[item.id] === item.answerIndex).length;
              return <div className={`pretest-results__level pretest-results__level--${level.toLowerCase()}`} key={level}><span>{level}</span><strong>{levelScore}<small> / {levelQuestions.length}</small></strong></div>;
            })}
          </div>
          <p className={`pretest-results__save ${saved ? "pretest-results__save--success" : "pretest-results__save--local"}`}><Check size={15} />{saved ? "Score saved on this device and added to your progress." : "Test scored. Browser storage was unavailable, so this score will not appear in Progress."}</p>
          <button className="button button--secondary" type="button" onClick={restartTest}><RotateCcw size={16} /> Retake theory test</button>
        </div>
        <section className="pretest-review" aria-labelledby="pretest-review-title">
          <div className="pretest-review__heading"><span className="eyebrow">ANSWER REVIEW</span><h3 id="pretest-review-title">Check your reasoning</h3></div>
          <div className="pretest-review__list">
            {logicGatesPretest.map((item) => {
              const selectedAnswerIndex = answers[item.id];
              const selectedAnswer = selectedAnswerIndex === undefined ? "No answer" : item.options[selectedAnswerIndex];
              const correct = selectedAnswerIndex === item.answerIndex;
              return <details className={`pretest-review__item ${correct ? "pretest-review__item--correct" : "pretest-review__item--incorrect"}`} key={item.id}>
                <summary><span>Q{String(item.id).padStart(2, "0")} · {item.difficulty}</span><strong>{correct ? "Correct" : "Review"}</strong></summary>
                <p className="pretest-review__prompt">{item.prompt}</p>
                <p><strong>Your answer:</strong> {selectedAnswer}</p>
                <p><strong>Correct answer:</strong> {item.options[item.answerIndex]}</p>
                <p className="pretest-review__explanation">{item.explanation}</p>
              </details>;
            })}
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="pretest" aria-labelledby="pretest-title">
      <header className="pretest__header">
        <div><span className="eyebrow">THEORY TEST · 20 MARKS</span><h3 id="pretest-title">Check what you know</h3><p>20 multiple-choice questions, from fundamentals to advanced. No timer and no negative marking. Submit whenever you are ready; unanswered questions count as zero. Correct answers and explanations appear after submission.</p></div>
        <div className="pretest__score-guide"><strong>1 mark</strong><span>for each correct answer</span></div>
      </header>
      <div className="pretest__progress-row"><span>{answeredCount} of {logicGatesPretest.length} answered</span><strong>{percent}%</strong></div>
      <div className="pretest__progress-track" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={logicGatesPretest.length} aria-valuenow={answeredCount}><span style={{ width: `${percent}%` }} /></div>
      <div className="pretest__difficulty-key" aria-label="Question levels">{levels.map((level) => <span className={`pretest__level-tag pretest__level-tag--${level.toLowerCase()}`} key={level}>{level}<small>5</small></span>)}</div>

      <nav className="pretest__question-nav" aria-label="Jump to question">
        {logicGatesPretest.map((item, index) => <button className={`pretest__question-dot ${index === currentIndex ? "pretest__question-dot--current" : ""} ${answers[item.id] !== undefined ? "pretest__question-dot--answered" : ""}`} type="button" key={item.id} onClick={() => setCurrentIndex(index)} aria-label={`Question ${item.id}${answers[item.id] !== undefined ? ", answered" : ", unanswered"}`} aria-current={index === currentIndex ? "step" : undefined}>{String(item.id).padStart(2, "0")}</button>)}
      </nav>

      <article className="pretest-question" aria-live="polite">
        <div className="pretest-question__meta"><span>QUESTION {String(question.id).padStart(2, "0")} / {logicGatesPretest.length}</span><span className={`pretest__level-tag pretest__level-tag--${question.difficulty.toLowerCase()}`}>{question.difficulty}</span></div>
        <h4>{question.prompt}</h4>
        <fieldset className="pretest-question__choices">
          <legend>Choose one answer</legend>
          {question.options.map((option, index) => <label className={`pretest-choice ${answers[question.id] === index ? "pretest-choice--selected" : ""}`} key={`${question.id}-${index}`}>
            <input type="radio" name={`question-${question.id}`} value={index} checked={answers[question.id] === index} onChange={() => setAnswers((previous) => ({ ...previous, [question.id]: index }))} />
            <span className="pretest-choice__letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>
          </label>)}
        </fieldset>
      </article>

      <div className="pretest__navigation">
        <button className="text-button" type="button" onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} disabled={currentIndex === 0}><ArrowLeft size={15} /> Previous</button>
        <span>Question {currentIndex + 1} of {logicGatesPretest.length}</span>
        {currentIndex < logicGatesPretest.length - 1 ? <button className="button button--primary button--small" type="button" onClick={() => setCurrentIndex((index) => Math.min(logicGatesPretest.length - 1, index + 1))}>Next question <ArrowRight size={15} /></button> : <span />}
      </div>
      <div className="pretest__submit-row">
        <div className="pretest__submit-copy"><strong>Ready to finish?</strong><span>{unansweredCount ? `${unansweredCount} unanswered question${unansweredCount === 1 ? "" : "s"} will count as zero marks.` : "All 20 questions are answered."}</span></div>
        <button className="button button--primary" type="button" onClick={submitTest}><Send size={16} /> Submit theory test</button>
      </div>
    </section>
  );
}

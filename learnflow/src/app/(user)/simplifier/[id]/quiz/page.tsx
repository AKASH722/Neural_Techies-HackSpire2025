import React from "react";
import QuizView from "@/section/quiz/view/quiz-view";

export default function Page({ params }: { params: { id: string } }) {
  return <QuizView id={parseInt(params.id)} />;
}

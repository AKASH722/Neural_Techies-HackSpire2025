// dashboard.jsx
"use client";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Trophy, BookOpen, CheckCircle } from "lucide-react";

export default function Dashboard() {
  // Dummy data for quizzes
  const quizData = [
    { name: "HTML", score: 80 },
    { name: "CSS", score: 70 },
    { name: "JavaScript", score: 60 },
  ];

  // Dummy data for achievements
  const achievements = [
    {
      id: 1,
      name: "First Quiz Completed",
      icon: <CheckCircle className="h-6 w-6 text-emerald-500" />,
    },
    {
      id: 2,
      name: "100% on Beginner Quiz",
      icon: <Trophy className="h-6 w-6 text-amber-500" />,
    },
  ];

  // Progress percentage
  const progressPercentage = 32;

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Banner */}
        <div className="mb-8 flex items-center justify-between rounded-lg bg-primary p-6 shadow-md">
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">
              Welcome back, Deep! 🚀
            </h1>
            <p className="text-primary-foreground/90">
              Ready for today's learning?
            </p>
          </div>
          <BookOpen className="h-8 w-8 text-primary-foreground" />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Progress Tracker */}
          <div className="rounded-lg bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Your Progress</h2>
            <div className="flex items-center gap-6">
              <div className="h-24 w-24">
                <CircularProgressbar
                  value={progressPercentage}
                  text={`${progressPercentage}%`}
                  styles={buildStyles({
                    textSize: "1.2rem",
                    pathColor: "hsl(251.90, 55.76%, 57.45%)",
                    textColor: "hsl(240, 27.59%, 22.75%)",
                    trailColor: "hsl(249.38, 100%, 93.73%)",
                  })}
                />
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Current Path</p>
                <p className="font-medium">Web Development — Beginner Path</p>
              </div>
            </div>
          </div>

          {/* Today's Learning Suggestion */}
          <div className="rounded-lg bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Today's Suggestion</h2>
            <div className="mb-4 rounded-md bg-secondary/50 p-4">
              <h3 className="font-medium">Take HTML Basics Quiz</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Continue where you left off and test your knowledge
              </p>
            </div>
            <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90">
              Resume Learning
            </button>
          </div>

          {/* Learning Streak */}
          <div className="rounded-lg bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Learning Streak</h2>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-amber-100 p-3"></div>
              <div>
                <p className="text-xl font-bold">5-day streak!</p>
                <p className="text-muted-foreground">
                  Keep it up, you're doing great!
                </p>
              </div>
            </div>
          </div>

          {/* Recent Quiz Scores */}
          <div className="rounded-lg bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:col-span-2">
            <h2 className="mb-4 text-lg font-semibold">Recent Quiz Scores</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizData}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(251.90, 55.76%, 57.45%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(251.90, 55.76%, 57.45%)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex gap-4">
              {quizData.map((quiz, idx) => (
                <div key={idx} className="flex items-center">
                  <div className={`mr-2 h-3 w-3 rounded-full bg-primary`}></div>
                  <span>
                    {quiz.name} — {quiz.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-lg bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Achievements</h2>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 rounded-md bg-accent/50 p-3"
                >
                  {achievement.icon}
                  <span>{achievement.name}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 rounded-md bg-muted p-3 text-muted-foreground">
                <Trophy className="h-6 w-6" />
                <span>Complete 3 more quizzes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

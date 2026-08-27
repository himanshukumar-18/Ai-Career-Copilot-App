import React from "react";
import TopicCard from "./TopicCard";
import { ListChecks } from "lucide-react";

const TopicList = ({ topics = [], onGenerateQuestions, isGeneratingQuestions }) => {
    if (!topics.length) {
        return (
            <div className="border border-[var(--border)] bg-[var(--surface)] p-8 text-center my-6">
                <ListChecks size={32} className="mx-auto text-[var(--text-muted)] mb-3" />
                <p className="font-mono text-sm text-[var(--text-muted)]">
                    No interview preparation topics generated yet.
                </p>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        Interview Preparation Topics
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] font-mono">
                        Prioritized study modules synthesized for your target role.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {topics.map((topic) => (
                    <TopicCard
                        key={topic.id}
                        topic={topic}
                        onGenerateQuestions={onGenerateQuestions}
                        isGeneratingQuestions={isGeneratingQuestions}
                    />
                ))}
            </div>
        </div>
    );
};

export default TopicList;

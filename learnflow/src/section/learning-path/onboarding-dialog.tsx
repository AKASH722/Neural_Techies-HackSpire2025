"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import OnboardingForm from "./onboarding-form";
import { createCourseFromRoadmap } from "@/section/learning-path/actions";
import { toast } from "sonner";

interface OnboardingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingDialog({
  isOpen,
  onClose,
}: OnboardingDialogProps) {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form completion
  const handleFormComplete = async (formData: { [key: string]: string }) => {
    setIsLoading(true);

    try {
      // Call the server action to generate the roadmap and create the course
      const result = await createCourseFromRoadmap({
        topic: formData.topic,
        skill_level: formData.skill_level,
        learning_style: formData.learning_style,
        module_preference: formData.module_preference,
      });

      if (result.success) {
        setIsComplete(true);
        toast.success("Your learning path has been generated successfully.");
        router.push(`/learning-path/${result.courseId}`);
        onClose();
      } else {
        toast.error("Error creating course");
      }
    } catch (error) {
      console.error("Failed to create course:", error);
      toast.error("Error creating course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-auto p-0 sm:max-w-[600px]">
        <OnboardingForm
          onComplete={handleFormComplete}
          isLoading={isLoading}
          isComplete={isComplete}
        />
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import YouTubeInput from "./forms/youtube-input";
import DocumentUpload from "./forms/document-upload";
import TextInput from "@/section/simplifier/forms/text-input-form";

export default function NewSimplifierModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Explanation</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="youtube" className="w-full">
          <TabsList className="mb-4 grid grid-cols-3">
            <TabsTrigger value="youtube">YouTube Video</TabsTrigger>
            <TabsTrigger value="document">Upload Document</TabsTrigger>
            <TabsTrigger value="text">Paste Text</TabsTrigger>
          </TabsList>
          <TabsContent value="youtube">
            <YouTubeInput onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="document">
            <DocumentUpload onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="text">
            <TextInput onSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

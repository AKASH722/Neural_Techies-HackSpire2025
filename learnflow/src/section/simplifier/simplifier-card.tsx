import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SimplifierCardProps {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  type: "youtube" | "document" | "text";
}

export default function SimplifierCard({
  id,
  title,
  content,
  createdAt,
  type,
}: SimplifierCardProps) {
  const typeBadgeColors = {
    youtube: "bg-red-100 text-red-800",
    document: "bg-blue-100 text-blue-800",
    text: "bg-green-100 text-green-800",
  };

  const typeLabels = {
    youtube: "YouTube",
    document: "Document",
    text: "Text",
  };

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <Link href={`/simplifier/${id}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="line-clamp-2">{title}</CardTitle>
            <Badge variant="outline" className={typeBadgeColors[type]}>
              {typeLabels[type]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-4 text-sm text-gray-600">{content}</p>
        </CardContent>
        <CardFooter className="text-xs text-gray-500">
          Created {timeAgo}
        </CardFooter>
      </Card>
    </Link>
  );
}

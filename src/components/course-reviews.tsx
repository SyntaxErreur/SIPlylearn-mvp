import { Star, StarHalf, User } from "lucide-react";
import { Card } from "./ui/card";

interface ReviewProps {
  reviews: {
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export default function CourseReviews({ reviews }: ReviewProps) {
  const averageRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-primary text-primary" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-primary text-primary" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />);
    }

    return stars;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {renderStars(averageRating)}
        </div>
        <div>
          <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground ml-2">({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{review.user}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="text-sm">{review.comment}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
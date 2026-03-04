/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Separator,
} from "@/core/libs";
import React from "react";

export interface CardDetailDataProps {
   
  dataDetail?: any;
}

export const CardDetailData = React.memo((props: CardDetailDataProps) => {
  return (
    <div className={cn("container mx-auto p-4")}>
      <Card className="w-full mx-auto">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">User Data</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <dl className="">
            {props.dataDetail.map((item: any, index: any) => (
              <div key={index} className="pb-4">
                <dt className="text-sm font-medium text-muted-foreground mb-1">
                  {item.key}
                </dt>
                <dd className="text-lg font-semibold">{item.value}</dd>
                {index < props.dataDetail.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
});

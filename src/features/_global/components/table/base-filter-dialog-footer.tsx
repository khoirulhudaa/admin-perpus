import React from "react";
import { Button, jsonHelper, lang } from "@/core/libs";
import { useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "@itokun99/http";

interface Props {
  onClose: () => void;
  filterToQueryParam: Record<string, string>;
}

export const BaseFilterDialogFooter = ({ onClose, filterToQueryParam }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleReset = () => {
    const newParams: Record<string, string> = {
      ...searchParamsToObject(searchParams.toString()),
      filter: jsonHelper.string([]),
    };

    Object.values(filterToQueryParam).forEach((paramKey) => {
      delete newParams[paramKey];
    });

    setSearchParams(newParams);
    onClose();
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button onClick={onClose} className="w-full">
    {lang.text("apply")}
      </Button>
      <Button variant="outline" onClick={handleReset} className="w-full">
        {lang.text("reset")}
      </Button>
    </div>
  );
};

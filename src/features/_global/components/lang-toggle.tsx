import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  lang,
} from "@/core/libs";
import { LanguageKeyType } from "@/core/libs/lang/types";

export const LangToggle = () => {
  const changeLang = (v: string) => {
    lang.setActiveLang(v as LanguageKeyType);
    window.location.reload();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <span className="font-bold">
            {String(lang.getActiveLang())?.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLang("id")}>
          Bahasa Indonesia (ID)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLang("en")}>
          English (EN)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

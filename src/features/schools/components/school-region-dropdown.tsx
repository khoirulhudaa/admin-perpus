import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, lang } from "@/core/libs";
import { RegionCheckboxItem } from "./school-region-checkboxItem";

  const central = lang.text('center');
  const south = lang.text('south');
  const north = lang.text('north');
  const west = lang.text('west');
  const east = lang.text('east');

  const regionLabels: Record<string, string> = {
    central,
    south,
    north,
    west,
    east
  };

  interface Regions {
    central: boolean;
    west: boolean,
    north: boolean,
    east: boolean,
    south: boolean;
  }

  interface RegionDropdownInterface {
    toggleRegion: (region: keyof Regions) => void;
    regions: Regions;
  }

  export const RegionDropdown = ({regions, toggleRegion}: RegionDropdownInterface) => {
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="bg-white text-black hover:bg-white/85 hover:text-black">
          <Button variant="outline">{lang.text('selectJakartaArea')}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-4 w-56 bg-white text-black">
          {Object.entries(regions).map(([key, value]) => (
            <RegionCheckboxItem
              key={key}
              label={regionLabels[key]}
              checked={value}
              onCheckedChange={() => toggleRegion(key as keyof Regions)}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
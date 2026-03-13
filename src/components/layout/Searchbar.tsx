import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Searchbar({
  className,
  onClick,
}: {
  className?: string;
  onClick?: (searchTerm: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <form>
      <Field className={cn(className, "mb-4")}>
        <ButtonGroup>
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            id="input-button-group"
            placeholder="Type to search..."
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              onClick?.(searchTerm);
            }}
            type={"submit"}
            variant="outline"
          >
            Search
          </Button>
        </ButtonGroup>
      </Field>
    </form>
  );
}

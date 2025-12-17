import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type UserRole = "organizator" | "polaznik";

interface RoleChooseProps {
  onSelect: (role: UserRole) => void;
}

export default function RoleChoose({ onSelect }: RoleChooseProps) {
  const [selected, setSelected] = useState<UserRole | null>(null);

  const roles: { key: UserRole; title: string; description: string }[] = [
    {
      key: "organizator",
      title: "Organizator",
      description: "Kreiraj i upravljaj događajima ili edukacijama.",
    },
    {
      key: "polaznik",
      title: "Polaznik",
      description: "Prijavi se i sudjeluj u dostupnim događajima.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="grid gap-6 max-w-2xl w-full">
        <h1 className="text-3xl font-semibold text-center">
          Odaberi svoju ulogu
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Card
              key={role.key}
              onClick={() => setSelected(role.key)}
              className={`cursor-pointer transition border-2 rounded-2xl shadow-sm hover:shadow-md ${
                selected === role.key
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <CardContent className="p-6 space-y-2 text-center">
                <h2 className="text-xl font-medium">{role.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {role.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          size="lg"
          className="mt-4"
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
        >
          Nastavi
        </Button>
      </div>
    </div>
  );
}

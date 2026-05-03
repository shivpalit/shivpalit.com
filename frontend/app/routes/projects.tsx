import type { Route } from "./+types/projects";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "~/components/max-width-wrapper";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ExternalLink, Star } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projects — Shiv Palit" },
    { name: "description", content: "GitHub projects and open source work." },
  ];
}

type Repo = {
  name: string;
  clean_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stars: number;
  updated_at: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "https://api.shivpalit.com";

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/gh-repos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "shivpalit" }),
    })
      .then((r) => r.json())
      .then((data) => {
        setRepos(data.repos ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load repositories.");
        setLoading(false);
      });
  }, []);

  return (
    <MaxWidthWrapper className="py-10 md:py-20">
      <h1 className="text-4xl font-bold mb-2">Projects</h1>
      <p className="text-muted-foreground mb-8">
        A collection of my work on GitHub.
      </p>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-muted-foreground">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="h-full flex flex-col group-hover:border-foreground/30 transition-colors">
                <CardHeader className="pb-2 flex-1">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="truncate">{repo.clean_name}</span>
                    <ExternalLink
                      size={14}
                      className="text-muted-foreground shrink-0 ml-2"
                    />
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {repo.description ?? "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center gap-3 pt-0">
                  {repo.language && (
                    <Badge variant="secondary" className="font-mono text-xs">
                      {repo.language}
                    </Badge>
                  )}
                  {repo.stars > 0 && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star size={12} />
                      {repo.stars}
                    </span>
                  )}
                </CardFooter>
              </Card>
            </a>
          ))}
        </div>
      )}
    </MaxWidthWrapper>
  );
}

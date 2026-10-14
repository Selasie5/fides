import { readdirSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import ts from "typescript";

const root = process.cwd();
const allowed = {
  "packages/domain": ["decimal.js"],
  "packages/contracts": ["zod"],
  "packages/sdk-ts": ["@fides/contracts"],
  "packages/test-fixtures": [],
  "apps/web": [
    "@fides/contracts",
    "@fides/sdk-ts",
    "@tanstack/react-query",
    "react",
    "react-dom",
  ],
  "apps/api": [
    "@fides/domain",
    "@fides/contracts",
    "@fides/test-fixtures",
    "dotenv",
    "drizzle-orm",
    "fastify",
    "pg",
    "zod",
  ],
  "apps/worker": ["dotenv", "zod", "pg", "drizzle-orm"],
};
let failures = 0;
function inspect(file, owner) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  function check(specifier) {
    if (specifier.startsWith(".")) {
      const target = resolve(dirname(file), specifier);
      if (relative(resolve(root, owner), target).startsWith(".."))
        fail(specifier);
      return;
    }
    if (
      specifier.startsWith("node:") &&
      owner.startsWith("apps/") &&
      owner !== "apps/web"
    )
      return;
    if (/\.test\.ts$/.test(file) && specifier === "vitest") return;
    if (
      !allowed[owner].some(
        (name) => specifier === name || specifier.startsWith(`${name}/`),
      )
    )
      fail(specifier);
  }
  function fail(specifier) {
    console.error(`${relative(root, file)}: forbidden dependency ${specifier}`);
    failures++;
  }
  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    )
      check(node.moduleSpecifier.text);
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        node.expression.getText(source) === "require")
    ) {
      const arg = node.arguments[0];
      if (arg && ts.isStringLiteral(arg)) check(arg.text);
      else fail("nonliteral dynamic import");
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
function walk(directory, owner) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) walk(file, owner);
    else if (/\.(ts|tsx)$/.test(file)) inspect(file, owner);
  }
}
for (const owner of Object.keys(allowed)) {
  const manifest = JSON.parse(
    readFileSync(resolve(root, owner, "package.json"), "utf8"),
  );
  for (const dependency of Object.keys(manifest.dependencies ?? {})) {
    if (!allowed[owner].includes(dependency)) {
      console.error(`${owner}: forbidden manifest dependency ${dependency}`);
      failures++;
    }
  }
  walk(resolve(root, owner, "src"), owner);
}
if (failures) process.exitCode = 1;
else console.info("Workspace import boundaries pass");

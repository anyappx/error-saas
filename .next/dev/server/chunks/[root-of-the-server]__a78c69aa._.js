module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/vibe/error-saas/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
const uri = process.env.MONGODB_URI;
const options = {};
let client;
let clientPromise;
if ("TURBOPACK compile-time truthy", 1) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = /*TURBOPACK member replacement*/ __turbopack_context__.g;
    if (!globalWithMongo._mongoClientPromise) {
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else //TURBOPACK unreachable
;
const __TURBOPACK__default__export__ = clientPromise;
}),
"[project]/vibe/error-saas/lib/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorSchema",
    ()=>ErrorSchema,
    "SubmissionSchema",
    ()=>SubmissionSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/vibe/error-saas/node_modules/.pnpm/zod@4.1.13/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
// Source schema for linking to documentation
const SourceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    url: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
    label: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const ErrorSchema = __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    tool: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("kubernetes"),
    canonical_slug: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    aliases: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    matchers: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        regex: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
    }),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "registry",
        "auth",
        "network",
        "storage",
        "scheduling",
        "runtime",
        "config",
        "unknown",
        "scheduler",
        "cluster"
    ]),
    summary: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    root_causes: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        name: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        why: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        confidence: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).max(1),
        sources: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(SourceSchema)
    })),
    fix_steps: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        step: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        commands: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
        sources: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(SourceSchema)
    })),
    clarifying_questions: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    examples: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        name: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        symptom: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        fix: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        sources: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(SourceSchema)
    })),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const SubmissionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    raw_text: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    normalized_text: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    matched_slug: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable(),
    matched_confidence: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
}),
"[project]/vibe/error-saas/lib/normalize.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Normalizes text according to the specification in master.md
 */ __turbopack_context__.s([
    "normalizeText",
    ()=>normalizeText
]);
function normalizeText(text) {
    // Limit length to 20,000 chars
    let normalized = text.slice(0, 20000);
    // Lowercase
    normalized = normalized.toLowerCase();
    // Strip ANSI color codes
    // eslint-disable-next-line no-control-regex
    normalized = normalized.replace(/\x1b\[[0-9;]*m/g, '');
    // Collapse whitespace
    normalized = normalized.replace(/\s+/g, ' ').trim();
    return normalized;
}
}),
"[project]/vibe/error-saas/lib/matcher.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "K8MatcherEngine",
    ()=>K8MatcherEngine,
    "createMatcher",
    ()=>createMatcher,
    "matchError",
    ()=>matchError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/vibe/error-saas/lib/normalize.ts [app-route] (ecmascript)");
;
class K8MatcherEngine {
    config;
    constructor(config){
        this.config = {
            exactMatchWeight: 50,
            regexWeight: 25,
            aliasWeight: 20,
            titleWeight: 15,
            summaryWeight: 10,
            causeWeight: 8,
            semanticWeight: 5,
            categoryBoost: {
                'runtime': 15,
                'network': 12,
                'auth': 10,
                'storage': 10,
                'config': 8,
                'scheduler': 8,
                'cluster': 8
            },
            lengthPenalty: true,
            fuzzyThreshold: 0.7,
            ...config
        };
    }
    /**
   * Matches normalized text against Kubernetes errors using weighted scoring
   */ matchError(normalizedText, errors) {
        if (!normalizedText.trim()) {
            return {
                slug: null,
                confidence: 0,
                score: 0,
                matchDetails: [],
                suggestions: []
            };
        }
        const queryTokens = this.tokenize(normalizedText);
        const results = errors.map((error)=>this.scoreError(normalizedText, queryTokens, error));
        // Sort by score descending
        results.sort((a, b)=>b.totalScore - a.totalScore);
        const topResult = results[0];
        const confidence = this.calculateConfidence(topResult?.totalScore || 0, normalizedText.length);
        // Get top 5 suggestions
        const suggestions = results.slice(0, 5).map((result)=>({
                slug: result.error.canonical_slug,
                title: result.error.title,
                category: result.error.category,
                score: Math.round(result.totalScore * 10) / 10
            }));
        return {
            slug: topResult?.error.canonical_slug || null,
            confidence,
            score: Math.round((topResult?.totalScore || 0) * 10) / 10,
            matchDetails: topResult?.details || [],
            suggestions
        };
    }
    scoreError(normalizedText, queryTokens, error) {
        const details = [];
        let totalScore = 0;
        // 1. Exact canonical slug match
        if (normalizedText === error.canonical_slug) {
            const score = this.config.exactMatchWeight;
            details.push({
                type: 'exact',
                pattern: error.canonical_slug,
                matchedText: normalizedText,
                score
            });
            totalScore += score;
        }
        // 2. Regex pattern matching
        const regexScore = this.scoreRegexMatches(normalizedText, error.matchers.regex, details);
        totalScore += regexScore;
        // 3. Alias matching
        const aliasScore = this.scoreAliasMatches(normalizedText, queryTokens, error.aliases, details);
        totalScore += aliasScore;
        // 4. Title matching
        const titleScore = this.scoreTitleMatch(normalizedText, queryTokens, error.title, details);
        totalScore += titleScore;
        // 5. Summary matching
        const summaryScore = this.scoreSummaryMatch(normalizedText, queryTokens, error.summary, details);
        totalScore += summaryScore;
        // 6. Root causes matching
        const causeScore = this.scoreCauseMatches(normalizedText, queryTokens, error.root_causes, details);
        totalScore += causeScore;
        // 7. Semantic/contextual matching
        const semanticScore = this.scoreSemanticMatches(normalizedText, queryTokens, error, details);
        totalScore += semanticScore;
        // 8. Category boost
        const categoryBoost = this.config.categoryBoost[error.category] || 0;
        if (categoryBoost > 0) {
            totalScore += categoryBoost;
            details.push({
                type: 'semantic',
                pattern: `category:${error.category}`,
                matchedText: error.category,
                score: categoryBoost
            });
        }
        // 9. Length penalty for very short queries
        if (this.config.lengthPenalty && normalizedText.length < 10) {
            totalScore *= 0.8;
        }
        return {
            error,
            totalScore,
            details
        };
    }
    scoreRegexMatches(text, patterns, details) {
        let score = 0;
        const matchedPatterns = new Set();
        for (const pattern of patterns){
            try {
                const regex = new RegExp(pattern, 'i');
                const match = text.match(regex);
                if (match && !matchedPatterns.has(pattern)) {
                    matchedPatterns.add(pattern);
                    const matchScore = this.config.regexWeight * (1 + match[0].length / text.length);
                    score += matchScore;
                    details.push({
                        type: 'regex',
                        pattern,
                        matchedText: match[0],
                        score: Math.round(matchScore * 10) / 10
                    });
                }
            } catch  {
                continue;
            }
        }
        return score;
    }
    scoreAliasMatches(text, tokens, aliases, details) {
        let score = 0;
        for (const alias of aliases){
            const normalizedAlias = (0, __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeText"])(alias);
            // Exact alias match
            if (text.includes(normalizedAlias)) {
                const matchScore = this.config.aliasWeight * (normalizedAlias.length / text.length);
                score += matchScore;
                details.push({
                    type: 'alias',
                    pattern: alias,
                    matchedText: normalizedAlias,
                    score: Math.round(matchScore * 10) / 10
                });
            } else {
                const aliasTokens = this.tokenize(normalizedAlias);
                const matchCount = tokens.filter((token)=>aliasTokens.some((at)=>at.includes(token) || token.includes(at))).length;
                if (matchCount > 0) {
                    const matchScore = this.config.aliasWeight * 0.5 * (matchCount / Math.max(tokens.length, aliasTokens.length));
                    score += matchScore;
                    details.push({
                        type: 'alias',
                        pattern: alias,
                        matchedText: tokens.filter((t)=>aliasTokens.some((at)=>at.includes(t))).join(' '),
                        score: Math.round(matchScore * 10) / 10
                    });
                }
            }
        }
        return score;
    }
    scoreTitleMatch(text, tokens, title, details) {
        const normalizedTitle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeText"])(title);
        if (text.includes(normalizedTitle) || normalizedTitle.includes(text)) {
            const matchScore = this.config.titleWeight;
            details.push({
                type: 'title',
                pattern: title,
                matchedText: title,
                score: matchScore
            });
            return matchScore;
        }
        // Token-based matching
        const titleTokens = this.tokenize(normalizedTitle);
        const matchCount = tokens.filter((token)=>titleTokens.some((tt)=>tt.includes(token) || token.includes(tt))).length;
        if (matchCount > 0) {
            const matchScore = this.config.titleWeight * 0.7 * (matchCount / titleTokens.length);
            details.push({
                type: 'title',
                pattern: title,
                matchedText: tokens.filter((t)=>titleTokens.some((tt)=>tt.includes(t))).join(' '),
                score: Math.round(matchScore * 10) / 10
            });
            return matchScore;
        }
        return 0;
    }
    scoreSummaryMatch(text, tokens, summary, details) {
        const normalizedSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeText"])(summary);
        const summaryTokens = this.tokenize(normalizedSummary);
        const matchCount = tokens.filter((token)=>summaryTokens.some((st)=>st.includes(token) && token.length > 3)).length;
        if (matchCount > 0) {
            const matchScore = this.config.summaryWeight * (matchCount / tokens.length);
            details.push({
                type: 'summary',
                pattern: summary.slice(0, 50) + '...',
                matchedText: tokens.filter((t)=>summaryTokens.some((st)=>st.includes(t))).join(' '),
                score: Math.round(matchScore * 10) / 10
            });
            return matchScore;
        }
        return 0;
    }
    scoreCauseMatches(text, tokens, causes, details) {
        let score = 0;
        for (const cause of causes.slice(0, 3)){
            const causeText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeText"])(`${cause.name} ${cause.why}`);
            const causeTokens = this.tokenize(causeText);
            const matchCount = tokens.filter((token)=>causeTokens.some((ct)=>ct.includes(token) && token.length > 3)).length;
            if (matchCount > 0) {
                const matchScore = this.config.causeWeight * (matchCount / tokens.length) * cause.confidence;
                score += matchScore;
                details.push({
                    type: 'cause',
                    pattern: cause.name,
                    matchedText: tokens.filter((t)=>causeTokens.some((ct)=>ct.includes(t))).join(' '),
                    score: Math.round(matchScore * 10) / 10
                });
            }
        }
        return score;
    }
    scoreSemanticMatches(text, tokens, error, details) {
        let score = 0;
        // Common Kubernetes error keywords
        const k8sKeywords = [
            'pod',
            'container',
            'deployment',
            'service',
            'node',
            'cluster',
            'image',
            'volume',
            'secret',
            'configmap',
            'namespace',
            'ingress',
            'kubelet',
            'api',
            'scheduler',
            'controller',
            'etcd',
            'proxy'
        ];
        const contextKeywords = error.fix_steps.flatMap((step)=>this.tokenize(step.step)).filter((token)=>k8sKeywords.includes(token)).slice(0, 5);
        const contextMatches = tokens.filter((token)=>contextKeywords.includes(token));
        if (contextMatches.length > 0) {
            const matchScore = this.config.semanticWeight * contextMatches.length;
            score += matchScore;
            details.push({
                type: 'semantic',
                pattern: 'kubernetes-context',
                matchedText: contextMatches.join(' '),
                score: Math.round(matchScore * 10) / 10
            });
        }
        return score;
    }
    calculateConfidence(score, textLength) {
        // Base confidence from score
        let confidence = 0;
        if (score >= 80) {
            confidence = 0.95;
        } else if (score >= 60) {
            confidence = 0.85;
        } else if (score >= 40) {
            confidence = 0.75;
        } else if (score >= 25) {
            confidence = 0.65;
        } else if (score >= 15) {
            confidence = 0.5;
        } else if (score >= 8) {
            confidence = 0.35;
        } else {
            confidence = 0.1;
        }
        // Adjust for text length
        if (textLength < 20) {
            confidence *= 0.8;
        } else if (textLength > 100) {
            confidence *= 0.9;
        }
        return Math.min(confidence, 0.99);
    }
    tokenize(text) {
        return text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter((token)=>token.length > 2);
    }
}
// Create default matcher instance
const defaultMatcher = new K8MatcherEngine();
function matchError(normalizedText, errors) {
    return defaultMatcher.matchError(normalizedText, errors);
}
function createMatcher(config) {
    return new K8MatcherEngine(config);
}
;
}),
"[project]/vibe/error-saas/app/api/explain/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/vibe/error-saas/node_modules/.pnpm/next@16.0.10_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/vibe/error-saas/node_modules/.pnpm/zod@4.1.13/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/vibe/error-saas/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/vibe/error-saas/lib/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/vibe/error-saas/lib/normalize.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$matcher$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/vibe/error-saas/lib/matcher.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const RequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    text: __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$13$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
async function POST(request) {
    try {
        const body = await request.json();
        const { text } = RequestSchema.parse(body);
        const client = await __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"];
        const db = client.db();
        // Get all Kubernetes errors
        const errorsCollection = db.collection('errors');
        const errors = await errorsCollection.find({
            tool: 'kubernetes'
        }).toArray();
        // Validate errors against schema
        const validErrors = errors.map((error)=>{
            try {
                return __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ErrorSchema"].parse(error);
            } catch  {
                return null;
            }
        }).filter((error)=>error !== null);
        // Normalize input text
        const normalizedText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$normalize$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeText"])(text);
        // Match error
        const matchResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$lib$2f$matcher$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["matchError"])(normalizedText, validErrors);
        // Save submission
        const submission = {
            raw_text: text,
            normalized_text: normalizedText,
            matched_slug: matchResult.slug,
            matched_confidence: matchResult.confidence,
            created_at: new Date().toISOString()
        };
        await db.collection('submissions').insertOne(submission);
        // Get matched error details
        let errorDetails = null;
        if (matchResult.slug) {
            errorDetails = validErrors.find((e)=>e.canonical_slug === matchResult.slug);
        }
        // Flatten sources from causes, steps, and examples
        const allSources = errorDetails ? [
            ...errorDetails.root_causes.flatMap((c)=>c.sources),
            ...errorDetails.fix_steps.flatMap((s)=>s.sources),
            ...errorDetails.examples.flatMap((e)=>e.sources)
        ] : [];
        // Remove duplicates
        const uniqueSources = allSources.filter((source, index, self)=>index === self.findIndex((s)=>s.url === source.url));
        // Determine clarifying question
        let clarifyingQuestion = null;
        if (matchResult.confidence < 0.6 && errorDetails) {
            clarifyingQuestion = errorDetails.clarifying_questions[0] || "Can you provide more context about when this error occurs?";
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            tool: 'kubernetes',
            match: {
                slug: matchResult.slug,
                confidence: matchResult.confidence
            },
            title: errorDetails?.title || null,
            summary: errorDetails?.summary || null,
            root_causes: errorDetails?.root_causes || [],
            fix_steps: errorDetails?.fix_steps || [],
            sources: uniqueSources,
            clarifying_question: clarifyingQuestion,
            suggestions: matchResult.confidence < 0.6 ? matchResult.suggestions : []
        });
    } catch (error) {
        console.error('API Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$vibe$2f$error$2d$saas$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to process request'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a78c69aa._.js.map
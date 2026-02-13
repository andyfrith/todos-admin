ALTER TABLE "todos" ALTER COLUMN "todo_type" SET DEFAULT 'ACTIVE';--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "todo_type" DROP NOT NULL;
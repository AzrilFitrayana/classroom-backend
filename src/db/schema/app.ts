import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
};

export const departments = pgTable("departments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),

  ...timestamps,
});

export const subjects = pgTable("subjects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  departmentId: integer("department_id")
    .notNull()
    .references(() => departments.id, { onDelete: "restrict" }),

  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),

  ...timestamps,
});

// Define relations for departments table
// One department can have many subjects, and one subject belongs to one department
export const departmentsRelations = relations(departments, ({ many }) => ({
  subjects: many(subjects),
}));

// Define relations for subjects table
// One subject belongs to one department, and one department can have many subjects
export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  department: one(departments, {
    fields: [subjects.departmentId], //foreign key field(s) in subject table
    references: [departments.id],  //primary key field(s) in department table
  }),
}));

export type Department = typeof departments.$inferSelect; //infers the type of a department record when selected from the database
export type NewDepartment = typeof departments.$inferInsert; //infers the type of a new department record when inserting into the database (excluding auto-generated fields like id and timestamps)

export type Subject = typeof subjects.$inferSelect; //infers the type of a subject record when selected from the database
export type NewSubject = typeof subjects.$inferInsert; //infers the type of a new subject record when inserting into the database (excluding auto-generated fields like id and timestamps)

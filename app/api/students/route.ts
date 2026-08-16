import {
  createStudent,
  getStudents,
} from "@/services/firebase/students.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";
import { StudentInput } from "@/types";

export async function GET() {
  try {
    const students = await getStudents();
    return successResponse(students, "Students retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve students", 500);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as StudentInput;
    const student = await createStudent(payload);
    return successResponse(student, "Student created successfully", 201);
  } catch {
    return errorResponse("Failed to create student", 500);
  }
}

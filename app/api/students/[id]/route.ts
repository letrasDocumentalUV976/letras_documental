import {
  deleteStudent,
  getStudentById,
  updateStudent,
} from "@/services/firebase/students.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";
import { StudentInput } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const student = await getStudentById(id);
    if (!student) return errorResponse("Student not found", 404);
    return successResponse(student, "Student retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve student", 500);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const payload = (await request.json()) as Partial<StudentInput>;
    await updateStudent(id, payload);
    return successResponse(null, "Student updated successfully");
  } catch {
    return errorResponse("Failed to update student", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    await deleteStudent(id);
    return successResponse(null, "Student deleted successfully");
  } catch {
    return errorResponse("Failed to delete student", 500);
  }
}

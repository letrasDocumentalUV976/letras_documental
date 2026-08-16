import { NextResponse } from "next/server";

export const successResponse = <T>(
  data: T,
  message: string,
  status = 200
) => NextResponse.json({ message, data }, { status });

export const errorResponse = (message: string, status = 400) =>
  NextResponse.json({ message }, { status });

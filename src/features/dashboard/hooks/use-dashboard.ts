import { lang } from "@/core/libs";
import { CardCounterProps } from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import { useCourse } from "@/features/course";
import { useParent } from "@/features/parents";
import { useSchool } from "@/features/schools";
import { useBiodata, useBiodataGuru } from "@/features/user";
import { useMemo } from "react";

export const useDashboard = () => {
  const student = useBiodata();
  const teacher = useBiodataGuru();
  const parent = useParent();
  const classroom = useClassroom();
  const school = useSchool();
  const course = useCourse();

  const isLoading =
    teacher.isLoading ||
    student.isLoading ||
    parent.isLoading ||
    classroom.isLoading ||
    school.isLoading ||
    course.isLoading;

  const isError =
    teacher.query.isError ||
    student.query.isError ||
    parent.query.isError ||
    classroom.query.isError ||
    school.query.isError ||
    course.query.isError;

  const counter = useMemo(
    () => ({
      student: student.data.length,
      teacher: teacher.data.length,
      school: school.data.length,
      classroom: classroom.data.length,
      parent: parent.data.length,
      course: course.data.length,
    }),
    [
      student.data,
      teacher.data,
      school.data,
      classroom.data,
      course.data,
      parent.data,
    ],
  );

  const summaryCardData = useMemo(
    (): CardCounterProps[] => [
      {
        label: lang.text("totalStudents"),
        value: String(counter.student),
        icon: "Users", // Nama string untuk ikon
      },
      {
        label: lang.text("totalTeachers"),
        value: String(counter.teacher),
        icon: "CircuitBoard", // Nama string untuk ikon
      },
      {
        label: lang.text("totalSchools"),
        value: String(counter.school),
        icon: "School", // Nama string untuk ikon
      },
      {
        label: lang.text("totalClasses"),
        value: String(counter.classroom),
        icon: "Building2", // Nama string untuk ikon
      },
      {
        label: lang.text("totalParents"),
        value: String(counter.parent),
        icon: "Users2", // Nama string untuk ikon
      },
      {
        label: lang.text("totalSubjects"),
        value: String(counter.course),
        icon: "Book", // Nama string untuk ikon
      },
    ],
    [counter],
  );

  return {
    counter,
    summaryCardData,
    isLoading,
    isError,
  };
};

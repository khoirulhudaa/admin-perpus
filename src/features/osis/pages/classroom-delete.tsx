/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/core/libs";
import {
  DashboardPageLayout,
  useVokadialog,
  Vokadialog,
} from "@/features/_global";
import { lang, simpleDecode } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useClassroomCreation } from "../hooks";
import { useAlert } from "@/features/_global";

export const ClassroomDelete = () => {
  const params = useParams();
  const navigate = useNavigate();
  const alert = useAlert();
  const classroomCreation = useClassroomCreation();
  const decodeParams: { id: string; text: string } = JSON.parse(
    simpleDecode(params.id || ""),
  );

  const dialog = useVokadialog();
  const showRef = useRef<typeof dialog.open>();
  showRef.current = dialog.open;

  const handleConfirmDelete = async () => {
    try {
      await classroomCreation.delete(Number(decodeParams?.id));
      alert.success(
        lang.text("successful", {
          context: lang.text("dataSuccessDelete", {
            context: decodeParams?.text,
          }),
        }),
      );
      navigate(-1);
    } catch (err: any) {
      alert.error(
        err?.message ||
          lang.text("failed", {
            context: lang.text("dataFailDelete", {
              context: decodeParams?.text,
            }),
          }),
      );
    }
  };

  useEffect(() => {
    showRef.current?.();
  }, []);

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("deleteClassroom")} ${decodeParams?.text} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("classroom"),
          url: "/classrooms",
        },
        {
          label: lang.text("deleteClassroom"),
          url: `/classrooms/delete/${params.id}`,
        },
        {
          label: String(decodeParams?.text),
          url: `/classrooms/delete/${params.id}`,
        },
      ]}
      title={lang.text("deleteClassroom")}
    >
      <Vokadialog
        visible={dialog.visible}
        title={lang.text("deleteConfirmation")}
        content={lang.text("deleteConfirmationDesc", {
          context: decodeParams?.text,
        })}
        footer={
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleConfirmDelete} variant="destructive">
              {lang.text("delete")}
            </Button>
            <Button onClick={() => navigate(-1)} variant="outline">
              {lang.text("cancel")}
            </Button>
          </div>
        }
      />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

import FileUpload from "@/components/UploadFile/FileUpload";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Nextjs Starter Template",
  description: "Home page of Nextjs Starter Template",
};

const page = async () => {
  return (
    <>
      <section className="grid h-[90dvh] place-items-center">
        <FileUpload />
      </section>
    </>
  );
};

export default page;

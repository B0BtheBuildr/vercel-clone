import { displayState } from "@/atoms";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";

import { useRecoilState } from "recoil";
import { z } from "zod";

type DeploymentData = {
  success: boolean;
  message: string;
  id?: string;
};

// url for deployment server
const DEPLOYMENT_REQUEST_SERVER = "http://localhost:3000";

const URLSchema = z.object({
  repoURL: z
    .string()
    .url()
    .refine((url) => url.startsWith("https://github.com")),
});

const UploadForm = () => {
  const [{ isDeploying, isUploading, uploadID }, setDisplayState] =
    useRecoilState(displayState);

  const form = useForm<z.infer<typeof URLSchema>>({
    defaultValues: { repoURL: "" },
  });

  const onSubmit = async (values: z.infer<typeof URLSchema>) => {
    setDisplayState((state) => {
      return {
        ...state,
        isDeployed: false,
      };
    });

    const { success } = URLSchema.safeParse(values);
    if (!success)
      return toast.error("Incorrect URL provided.", { duration: 1000 });

    setDisplayState((state) => {
      return { ...state, repoURL: values.repoURL, isUploading: true };
    });

    try {
      const { data } = await axios.post<DeploymentData | undefined>(
        `${DEPLOYMENT_REQUEST_SERVER}/deploy`,
        { repoURL: values.repoURL }
      );

      if (!data?.success) {
        setDisplayState((state) => {
          return { ...state, isUploading: false };
        });
        return toast.error("Error getting data.", { duration: 1000 });
      }

      if (!data || !data.success) {
        setDisplayState((state) => {
          return { ...state, isUploading: false };
        });
        return toast.error(data.message, { duration: 1000 });
      }

      const id = data.id;
      setDisplayState((state) => {
        return {
          ...state,
          isUploading: false,
          uploadID: id!,
          isDeploying: true,
        };
      });

      const interval = setInterval(async () => {
        const response = await axios.get(
          `${DEPLOYMENT_REQUEST_SERVER}/status?id=${id}`
        );

        if (response.data.status === "deployed") {
          clearInterval(interval);
          setDisplayState((state) => {
            return {
              ...state,
              isDeploying: false,
              isDeployed: true,
            };
          });
          return toast.success(`${id} deployed.`);
        }
      }, 5000);
    } catch (err) {
      console.log(err);
      setDisplayState({
        isUploading: false,
        isDeploying: false,
        repoURL: "",
        uploadID: "",
        isDeployed: false,
      });
      return toast.error("Server is down.", { duration: 1000 });
    }
  };

  return (
    <div className="bg-white p-10 rounded-lg w-[400px] border-gray-200 border-2 flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="repoURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl flex flex-col items-center mb-8">
                  GitHub Repo URL
                </FormLabel>
                <FormDescription>
                  Enter the URL of your repo below.
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="https://github.com/username/repo"
                    {...field}
                    disabled={isDeploying || isUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full flex flex-row gap-4"
            type="submit"
            disabled={isUploading || isDeploying}
          >
            <HashLoader
              size="16px"
              color="#ffffff"
              loading={isUploading || isDeploying}
            ></HashLoader>
            {isUploading
              ? "Uploading..."
              : isDeploying
              ? "Deploying (" + uploadID + ")"
              : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UploadForm;

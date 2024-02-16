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
import { FC } from "react";
import { useForm } from "react-hook-form";

interface GoToPageProps {
  uploadID: string; // or dataItemId: string
}

const GoToPageForm: FC<GoToPageProps> = ({ uploadID }) => {
  const form = useForm({ defaultValues: { visitURL: "" } });
  const url = `https://${uploadID}.dev.url.com:3001/index.html`;

  return (
    <div className="bg-white p-10 rounded-lg w-[400px] border-gray-200 border-2 flex flex-col">
      <Form {...form}>
        <form className="space-y-8">
          <FormField
            control={form.control}
            name="visitURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl flex flex-col items-center mb-8">
                  Deployment Status
                </FormLabel>
                <FormDescription>Visit your website now.</FormDescription>
                <FormControl>
                  <Input placeholder={url} {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="button">
            <a href={url} target="_blank">
              Launch
            </a>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default GoToPageForm;

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, app } from "@/lib/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  profilePicture: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size should be 5MB or less") // size check
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file.type),
      "Unsupported file format"
    )
    .optional(),
});

export default function ProfileForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      profilePicture: undefined, // Ensure profilePicture is handled properly
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser?.uid; //check
      if (!user) {
        setError("User not authenticated.");
        return;
      }

      const storage = getStorage(app); //should it be here?
      let profilePictureUrl = null;

      // Upload Profile Picture if provided
      const file = values.profilePicture
      if (file) {
        const storageRef = ref(storage, `profilePictures/${user}/${file.name}`);
        await uploadBytes(storageRef, file);
        profilePictureUrl = await getDownloadURL(storageRef);
      }

      // Update Firestore Document
      await updateDoc(doc(db, "users", user), {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        profilePictureUrl: profilePictureUrl || null, // Ensure null if not uploaded
      });

      router.push("/login"); 
    } catch (err: any) {
      setError(err.message);
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your first name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your last name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Profile Picture</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => form.setValue("profilePicture", e.target.files?.[0])}
            />
          </FormControl>
        </FormItem>
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}

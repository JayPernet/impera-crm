
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { toast } from "sonner";

interface UploadFileParams {
    file: File;
    leadId: string;
}

export function useUploadChatMedia() {
    const { organizationId } = useCrmUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ file, leadId }: UploadFileParams) => {
            if (!organizationId) throw new Error("Organization ID not found");

            // 1. Sanitize filename
            const fileExt = file.name.split(".").pop();
            const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const timestamp = Date.now();
            const uniqueName = `${timestamp}_${cleanFileName}`;

            // 2. Build Path: {organization_id}/{lead_id}/{timestamp}_{filename}
            const filePath = `${organizationId}/${leadId}/${uniqueName}`;

            // 3. Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from("chat-media")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // 4. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from("chat-media")
                .getPublicUrl(filePath);

            return {
                publicUrl,
                fileName: file.name,
                mediaType: file.type.split("/")[0], // 'image', 'audio', etc.
                filePath
            };
        },
        onError: (error) => {
            console.error("Upload failed", error);
            toast.error("Erro ao fazer upload do arquivo");
        }
    });
}

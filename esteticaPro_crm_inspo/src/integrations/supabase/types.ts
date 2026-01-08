export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          clicked_at: string | null
          country: string | null
          id: string
          link_id: string | null
          referrer: string | null
          user_agent: string | null
          user_id: string | null
          visitor_ip: string | null
        }
        Insert: {
          clicked_at?: string | null
          country?: string | null
          id?: string
          link_id?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
          visitor_ip?: string | null
        }
        Update: {
          clicked_at?: string | null
          country?: string | null
          id?: string
          link_id?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          key: string
          name: string
          provider: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          name: string
          provider: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          name?: string
          provider?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string
          created_at: string | null
          icon: string
          id: string
          name: string
          type: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string | null
          icon?: string
          id?: string
          name: string
          type: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string | null
          icon?: string
          id?: string
          name?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string | null
          functionality_type: string | null
          id: string
          message: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          functionality_type?: string | null
          id?: string
          message: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          functionality_type?: string | null
          id?: string
          message?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_anamnesis: {
        Row: {
          adverse_reactions: string | null
          allergies: string | null
          chronic_diseases: string[] | null
          client_id: string
          created_at: string | null
          disclaimer_accepted: boolean | null
          disclaimer_accepted_at: string | null
          expectation: string | null
          history_current_problem: string | null
          home_care_routine: string | null
          id: string
          intestinal_function: string | null
          is_pregnant_or_breastfeeding: boolean | null
          lifestyle_habits: string[] | null
          main_complaint: string | null
          medications_in_use: string | null
          organization_id: string
          previous_procedures: string | null
          professional_notes: string | null
          skin_phototype: string | null
          skin_type: string | null
          sleep_quality: string | null
          sun_exposure: string | null
          surgeries_implants: string | null
          updated_at: string | null
          water_intake: string | null
        }
        Insert: {
          adverse_reactions?: string | null
          allergies?: string | null
          chronic_diseases?: string[] | null
          client_id: string
          created_at?: string | null
          disclaimer_accepted?: boolean | null
          disclaimer_accepted_at?: string | null
          expectation?: string | null
          history_current_problem?: string | null
          home_care_routine?: string | null
          id?: string
          intestinal_function?: string | null
          is_pregnant_or_breastfeeding?: boolean | null
          lifestyle_habits?: string[] | null
          main_complaint?: string | null
          medications_in_use?: string | null
          organization_id: string
          previous_procedures?: string | null
          professional_notes?: string | null
          skin_phototype?: string | null
          skin_type?: string | null
          sleep_quality?: string | null
          sun_exposure?: string | null
          surgeries_implants?: string | null
          updated_at?: string | null
          water_intake?: string | null
        }
        Update: {
          adverse_reactions?: string | null
          allergies?: string | null
          chronic_diseases?: string[] | null
          client_id?: string
          created_at?: string | null
          disclaimer_accepted?: boolean | null
          disclaimer_accepted_at?: string | null
          expectation?: string | null
          history_current_problem?: string | null
          home_care_routine?: string | null
          id?: string
          intestinal_function?: string | null
          is_pregnant_or_breastfeeding?: boolean | null
          lifestyle_habits?: string[] | null
          main_complaint?: string | null
          medications_in_use?: string | null
          organization_id?: string
          previous_procedures?: string | null
          professional_notes?: string | null
          skin_phototype?: string | null
          skin_type?: string | null
          sleep_quality?: string | null
          sun_exposure?: string | null
          surgeries_implants?: string | null
          updated_at?: string | null
          water_intake?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_anamnesis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_anamnesis_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_anamnesis_history: {
        Row: {
          archived_at: string | null
          created_by: string | null
          data_snapshot: Json
          id: string
          marked_for_deletion: boolean | null
          original_anamnesis_id: string | null
        }
        Insert: {
          archived_at?: string | null
          created_by?: string | null
          data_snapshot: Json
          id?: string
          marked_for_deletion?: boolean | null
          original_anamnesis_id?: string | null
        }
        Update: {
          archived_at?: string | null
          created_by?: string | null
          data_snapshot?: Json
          id?: string
          marked_for_deletion?: boolean | null
          original_anamnesis_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_anamnesis_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_anamnesis_history_original_anamnesis_id_fkey"
            columns: ["original_anamnesis_id"]
            isOneToOne: false
            referencedRelation: "crm_anamnesis"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_appointments: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          lead_id: string | null
          notes: string | null
          organization_id: string
          procedure_id: string | null
          professional_id: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          updated_at: string | null
          value: number | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          organization_id: string
          procedure_id?: string | null
          professional_id?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          organization_id?: string
          procedure_id?: string | null
          professional_id?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_appointments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_appointments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_appointments_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "crm_procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_client_procedures: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          procedure_id: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          procedure_id: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          procedure_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_client_procedures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_client_procedures_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "crm_procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_clients: {
        Row: {
          active: boolean | null
          converted_at: string | null
          created_at: string | null
          email: string | null
          estimated_revenue: number | null
          id: string
          last_appointment_at: string | null
          lead_id: string | null
          name: string
          next_return_at: string | null
          notes: string | null
          nps_token: string | null
          organization_id: string
          phone: string | null
          total_appointments: number | null
        }
        Insert: {
          active?: boolean | null
          converted_at?: string | null
          created_at?: string | null
          email?: string | null
          estimated_revenue?: number | null
          id?: string
          last_appointment_at?: string | null
          lead_id?: string | null
          name: string
          next_return_at?: string | null
          notes?: string | null
          nps_token?: string | null
          organization_id: string
          phone?: string | null
          total_appointments?: number | null
        }
        Update: {
          active?: boolean | null
          converted_at?: string | null
          created_at?: string | null
          email?: string | null
          estimated_revenue?: number | null
          id?: string
          last_appointment_at?: string | null
          lead_id?: string | null
          name?: string
          next_return_at?: string | null
          notes?: string | null
          nps_token?: string | null
          organization_id?: string
          phone?: string | null
          total_appointments?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_clients_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_interactions: {
        Row: {
          content: string | null
          created_at: string | null
          file_name: string | null
          id: string
          is_inbound: boolean | null
          lead_id: string
          media_type: string | null
          media_url: string | null
          message_id: string | null
          read: boolean | null
          type: Database["public"]["Enums"]["interaction_type"]
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_name?: string | null
          id?: string
          is_inbound?: boolean | null
          lead_id: string
          media_type?: string | null
          media_url?: string | null
          message_id?: string | null
          read?: boolean | null
          type: Database["public"]["Enums"]["interaction_type"]
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_name?: string | null
          id?: string
          is_inbound?: boolean | null
          lead_id?: string
          media_type?: string | null
          media_url?: string | null
          message_id?: string | null
          read?: boolean | null
          type?: Database["public"]["Enums"]["interaction_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_lead_procedures: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string
          procedure_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id: string
          procedure_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string
          procedure_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_lead_procedures_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_lead_procedures_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "crm_procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_lead_tags: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_lead_tags_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_lead_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "crm_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          ai_active: boolean | null
          assigned_to: string | null
          created_at: string | null
          current_proposal: string | null
          email: string | null
          first_contact_at: string | null
          id: string
          last_interaction_at: string | null
          loss_description: string | null
          loss_reason: string | null
          marked_for_deletion: boolean | null
          name: string
          notes: string | null
          organization_id: string
          phone: string | null
          source_detail: string | null
          source_type: Database["public"]["Enums"]["source_type"] | null
          status: Database["public"]["Enums"]["lead_status"] | null
          temperature: Database["public"]["Enums"]["temperature"] | null
          updated_at: string | null
        }
        Insert: {
          ai_active?: boolean | null
          assigned_to?: string | null
          created_at?: string | null
          current_proposal?: string | null
          email?: string | null
          first_contact_at?: string | null
          id?: string
          last_interaction_at?: string | null
          loss_description?: string | null
          loss_reason?: string | null
          marked_for_deletion?: boolean | null
          name: string
          notes?: string | null
          organization_id: string
          phone?: string | null
          source_detail?: string | null
          source_type?: Database["public"]["Enums"]["source_type"] | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          temperature?: Database["public"]["Enums"]["temperature"] | null
          updated_at?: string | null
        }
        Update: {
          ai_active?: boolean | null
          assigned_to?: string | null
          created_at?: string | null
          current_proposal?: string | null
          email?: string | null
          first_contact_at?: string | null
          id?: string
          last_interaction_at?: string | null
          loss_description?: string | null
          loss_reason?: string | null
          marked_for_deletion?: boolean | null
          name?: string
          notes?: string | null
          organization_id?: string
          phone?: string | null
          source_detail?: string | null
          source_type?: Database["public"]["Enums"]["source_type"] | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          temperature?: Database["public"]["Enums"]["temperature"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_notifications: {
        Row: {
          created_at: string | null
          id: string
          link_url: string | null
          message: string | null
          organization_id: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link_url?: string | null
          message?: string | null
          organization_id: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link_url?: string | null
          message?: string | null
          organization_id?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_nps_ratings: {
        Row: {
          client_id: string
          created_at: string | null
          feedback: string | null
          id: string
          organization_id: string
          origin: string | null
          score: number | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          organization_id: string
          origin?: string | null
          score?: number | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          organization_id?: string
          origin?: string | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_nps_ratings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_nps_ratings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_organizations: {
        Row: {
          active: boolean | null
          address: string | null
          business_hours: Json | null
          cnpj: string | null
          created_at: string | null
          email: string | null
          feature_ai_assistant: boolean | null
          id: string
          id_instancia_z_api: string | null
          instagram: string | null
          name: string
          phone: string | null
          settings: Json | null
          token_z_api: string | null
          updated_at: string | null
          whatsapp_identifier: string | null
          zapi_identifier: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          business_hours?: Json | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          feature_ai_assistant?: boolean | null
          id?: string
          id_instancia_z_api?: string | null
          instagram?: string | null
          name: string
          phone?: string | null
          settings?: Json | null
          token_z_api?: string | null
          updated_at?: string | null
          whatsapp_identifier?: string | null
          zapi_identifier?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          business_hours?: Json | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          feature_ai_assistant?: boolean | null
          id?: string
          id_instancia_z_api?: string | null
          instagram?: string | null
          name?: string
          phone?: string | null
          settings?: Json | null
          token_z_api?: string | null
          updated_at?: string | null
          whatsapp_identifier?: string | null
          zapi_identifier?: string | null
        }
        Relationships: []
      }
      crm_procedures: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          name: string
          organization_id: string
          return_days: number | null
          suggested_price: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          organization_id: string
          return_days?: number | null
          suggested_price?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string
          return_days?: number | null
          suggested_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_procedures_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_professional_procedures: {
        Row: {
          created_at: string | null
          id: string
          procedure_id: string
          professional_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          procedure_id: string
          professional_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          procedure_id?: string
          professional_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_professional_procedures_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "crm_procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_professional_procedures_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_tags: {
        Row: {
          active: boolean | null
          color: string | null
          created_at: string | null
          id: string
          marked_for_deletion: boolean | null
          name: string
          organization_id: string
          procedure_name: string | null
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          id?: string
          marked_for_deletion?: boolean | null
          name: string
          organization_id: string
          procedure_name?: string | null
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          id?: string
          marked_for_deletion?: boolean | null
          name?: string
          organization_id?: string
          procedure_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_tags_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_tasks: {
        Row: {
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          organization_id: string
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          task_type: Database["public"]["Enums"]["task_type"] | null
          title: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          organization_id: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_type?: Database["public"]["Enums"]["task_type"] | null
          title: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          organization_id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_type?: Database["public"]["Enums"]["task_type"] | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_ticket_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          ticket_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_tickets: {
        Row: {
          client_id: string | null
          created_at: string | null
          description: string | null
          id: string
          priority: string
          status: string
          title: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_users: {
        Row: {
          active: boolean | null
          created_at: string | null
          created_by: string | null
          email: string
          gender: string | null
          id: string
          name: string
          organization_id: string | null
          preferences: Json | null
          specialties: string[] | null
          supabase_auth_id: string
          updated_at: string | null
          working_days: string[] | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          email: string
          gender?: string | null
          id?: string
          name: string
          organization_id?: string | null
          preferences?: Json | null
          specialties?: string[] | null
          supabase_auth_id: string
          updated_at?: string | null
          working_days?: string[] | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          email?: string
          gender?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          preferences?: Json | null
          specialties?: string[] | null
          supabase_auth_id?: string
          updated_at?: string | null
          working_days?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "crm_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      keepalive: {
        Row: {
          id: string
          timestamp: string
        }
        Insert: {
          id: string
          timestamp?: string
        }
        Update: {
          id?: string
          timestamp?: string
        }
        Relationships: []
      }
      links: {
        Row: {
          background_color: string | null
          border_color: string | null
          click_count: number | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_visible: boolean | null
          order_index: number | null
          text_alignment: string | null
          text_color: string | null
          title: string
          updated_at: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          background_color?: string | null
          border_color?: string | null
          click_count?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          order_index?: number | null
          text_alignment?: string | null
          text_color?: string | null
          title: string
          updated_at?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          background_color?: string | null
          border_color?: string | null
          click_count?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          order_index?: number | null
          text_alignment?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      n8n_historico_mensagens: {
        Row: {
          created_at: string | null
          id: string
          message: Json
          session_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: Json
          session_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      portal_academy_modules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order_index: number | null
          thumbnail_url: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          thumbnail_url?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      portal_ad_campaigns: {
        Row: {
          budget: number | null
          campaign_name: string
          clicks: number | null
          client_id: string | null
          conversions: number | null
          cpa: number | null
          cpc: number | null
          ctr: number | null
          id: string
          impressions: number | null
          platform: string | null
          roas: number | null
          spent: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          campaign_name: string
          clicks?: number | null
          client_id?: string | null
          conversions?: number | null
          cpa?: number | null
          cpc?: number | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          platform?: string | null
          roas?: number | null
          spent?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          campaign_name?: string
          clicks?: number | null
          client_id?: string | null
          conversions?: number | null
          cpa?: number | null
          cpc?: number | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          platform?: string | null
          roas?: number | null
          spent?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_ad_campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_brand_assets: {
        Row: {
          category: Database["public"]["Enums"]["portal_brand_asset_category"]
          client_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["portal_brand_asset_type"]
          updated_at: string | null
          url: string
        }
        Insert: {
          category: Database["public"]["Enums"]["portal_brand_asset_category"]
          client_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          title: string
          type?: Database["public"]["Enums"]["portal_brand_asset_type"]
          updated_at?: string | null
          url: string
        }
        Update: {
          category?: Database["public"]["Enums"]["portal_brand_asset_category"]
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["portal_brand_asset_type"]
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_brand_assets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_brand_assets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "portal_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      portal_client_academy_progress: {
        Row: {
          client_id: string
          completed_at: string | null
          module_id: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          module_id: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          module_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_client_academy_progress_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_client_analysts: {
        Row: {
          analyst_id: string
          client_id: string
          created_at: string | null
          id: string
          is_account_leader: boolean | null
          job_title: string[] | null
        }
        Insert: {
          analyst_id: string
          client_id: string
          created_at?: string | null
          id?: string
          is_account_leader?: boolean | null
          job_title?: string[] | null
        }
        Update: {
          analyst_id?: string
          client_id?: string
          created_at?: string | null
          id?: string
          is_account_leader?: boolean | null
          job_title?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_client_analysts_analyst_id_fkey"
            columns: ["analyst_id"]
            isOneToOne: false
            referencedRelation: "portal_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "portal_client_analysts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_client_courses: {
        Row: {
          client_id: string | null
          course_id: string | null
          created_at: string | null
          id: string
        }
        Insert: {
          client_id?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
        }
        Update: {
          client_id?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_client_courses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_client_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "portal_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_client_status_history: {
        Row: {
          changed_at: string
          changed_by: string
          client_id: string
          id: string
          new_status: Database["public"]["Enums"]["portal_client_status"]
          old_status: Database["public"]["Enums"]["portal_client_status"] | null
          reason: string | null
        }
        Insert: {
          changed_at?: string
          changed_by: string
          client_id: string
          id?: string
          new_status: Database["public"]["Enums"]["portal_client_status"]
          old_status?:
            | Database["public"]["Enums"]["portal_client_status"]
            | null
          reason?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string
          client_id?: string
          id?: string
          new_status?: Database["public"]["Enums"]["portal_client_status"]
          old_status?:
            | Database["public"]["Enums"]["portal_client_status"]
            | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_client_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "portal_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "portal_client_status_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_client_team: {
        Row: {
          can_approve_content: boolean | null
          client_id: string | null
          created_at: string | null
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          can_approve_content?: boolean | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          can_approve_content?: boolean | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_client_team_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "portal_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "portal_client_team_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_clients: {
        Row: {
          active: boolean | null
          ads_spend_cache: number | null
          analyst_id: string | null
          billing_cycle: number | null
          contract_duration: number | null
          contract_start: string | null
          contract_value: number | null
          contracted_products: string[] | null
          created_at: string | null
          crm_organization_id: string | null
          has_crm_access: boolean | null
          health_score: number | null
          id: string
          is_delinquent: boolean | null
          leads_count_cache: number | null
          logo_url: string | null
          mrr: number | null
          name: string
          operational_status: string | null
          plan_tier: Database["public"]["Enums"]["portal_plan_tier"] | null
          primary_contact: string | null
          project_status:
            | Database["public"]["Enums"]["portal_project_status"]
            | null
          quick_links: Json | null
          status: Database["public"]["Enums"]["portal_client_status"]
          strategic_notes: string | null
        }
        Insert: {
          active?: boolean | null
          ads_spend_cache?: number | null
          analyst_id?: string | null
          billing_cycle?: number | null
          contract_duration?: number | null
          contract_start?: string | null
          contract_value?: number | null
          contracted_products?: string[] | null
          created_at?: string | null
          crm_organization_id?: string | null
          has_crm_access?: boolean | null
          health_score?: number | null
          id?: string
          is_delinquent?: boolean | null
          leads_count_cache?: number | null
          logo_url?: string | null
          mrr?: number | null
          name: string
          operational_status?: string | null
          plan_tier?: Database["public"]["Enums"]["portal_plan_tier"] | null
          primary_contact?: string | null
          project_status?:
            | Database["public"]["Enums"]["portal_project_status"]
            | null
          quick_links?: Json | null
          status?: Database["public"]["Enums"]["portal_client_status"]
          strategic_notes?: string | null
        }
        Update: {
          active?: boolean | null
          ads_spend_cache?: number | null
          analyst_id?: string | null
          billing_cycle?: number | null
          contract_duration?: number | null
          contract_start?: string | null
          contract_value?: number | null
          contracted_products?: string[] | null
          created_at?: string | null
          crm_organization_id?: string | null
          has_crm_access?: boolean | null
          health_score?: number | null
          id?: string
          is_delinquent?: boolean | null
          leads_count_cache?: number | null
          logo_url?: string | null
          mrr?: number | null
          name?: string
          operational_status?: string | null
          plan_tier?: Database["public"]["Enums"]["portal_plan_tier"] | null
          primary_contact?: string | null
          project_status?:
            | Database["public"]["Enums"]["portal_project_status"]
            | null
          quick_links?: Json | null
          status?: Database["public"]["Enums"]["portal_client_status"]
          strategic_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_clients_crm_organization_id_fkey"
            columns: ["crm_organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          task_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          task_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "portal_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      portal_creative_assets: {
        Row: {
          category: string
          client_id: string | null
          created_at: string | null
          id: string
          size: string | null
          title: string
          type: string
          url: string | null
        }
        Insert: {
          category: string
          client_id?: string | null
          created_at?: string | null
          id?: string
          size?: string | null
          title: string
          type: string
          url?: string | null
        }
        Update: {
          category?: string
          client_id?: string | null
          created_at?: string | null
          id?: string
          size?: string | null
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_creative_assets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_deleted_clients: {
        Row: {
          client_email: string | null
          client_name: string
          client_snapshot: Json
          deleted_at: string
          deleted_by: string
          deletion_reason: string | null
          id: string
          original_client_id: string
          related_data_counts: Json | null
        }
        Insert: {
          client_email?: string | null
          client_name: string
          client_snapshot: Json
          deleted_at?: string
          deleted_by: string
          deletion_reason?: string | null
          id?: string
          original_client_id: string
          related_data_counts?: Json | null
        }
        Update: {
          client_email?: string | null
          client_name?: string
          client_snapshot?: Json
          deleted_at?: string
          deleted_by?: string
          deletion_reason?: string | null
          id?: string
          original_client_id?: string
          related_data_counts?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_deleted_clients_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "portal_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      portal_financial_history: {
        Row: {
          active_clients: number
          created_at: string | null
          id: string
          recorded_at: string
          total_mrr: number
        }
        Insert: {
          active_clients?: number
          created_at?: string | null
          id?: string
          recorded_at?: string
          total_mrr?: number
        }
        Update: {
          active_clients?: number
          created_at?: string | null
          id?: string
          recorded_at?: string
          total_mrr?: number
        }
        Relationships: []
      }
      portal_invoices: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          description: string | null
          due_date: string
          id: string
          invoice_url: string | null
          paid_at: string | null
          payment_link: string | null
          status: Database["public"]["Enums"]["portal_invoice_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          invoice_url?: string | null
          paid_at?: string | null
          payment_link?: string | null
          status?: Database["public"]["Enums"]["portal_invoice_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          invoice_url?: string | null
          paid_at?: string | null
          payment_link?: string | null
          status?: Database["public"]["Enums"]["portal_invoice_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_job_titles: {
        Row: {
          created_at: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      portal_lessons: {
        Row: {
          course_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          marketing_content: boolean | null
          module_title: string | null
          order_index: number | null
          title: string
          video_url: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          marketing_content?: boolean | null
          module_title?: string | null
          order_index?: number | null
          title: string
          video_url: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          marketing_content?: boolean | null
          module_title?: string | null
          order_index?: number | null
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "portal_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_meeting_history: {
        Row: {
          client_id: string | null
          created_at: string | null
          date_recorded: string
          duration: unknown
          id: string
          thumbnail_url: string | null
          title: string
          video_url: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          date_recorded: string
          duration?: unknown
          id?: string
          thumbnail_url?: string | null
          title: string
          video_url: string
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          date_recorded?: string
          duration?: unknown
          id?: string
          thumbnail_url?: string | null
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_meeting_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_meetings: {
        Row: {
          client_id: string
          created_at: string
          date_recorded: string | null
          duration: string | null
          id: string
          meeting_url: string | null
          notes: string | null
          scheduled_at: string | null
          status: string | null
          thumbnail_url: string | null
          title: string
          topics: Json | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          date_recorded?: string | null
          duration?: string | null
          id?: string
          meeting_url?: string | null
          notes?: string | null
          scheduled_at?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title: string
          topics?: Json | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          date_recorded?: string | null
          duration?: string | null
          id?: string
          meeting_url?: string | null
          notes?: string | null
          scheduled_at?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          topics?: Json | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_monthly_investments: {
        Row: {
          ads_investment: number
          client_id: string
          created_at: string
          id: string
          month_year: string
          updated_at: string
        }
        Insert: {
          ads_investment?: number
          client_id: string
          created_at?: string
          id?: string
          month_year: string
          updated_at?: string
        }
        Update: {
          ads_investment?: number
          client_id?: string
          created_at?: string
          id?: string
          month_year?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_monthly_investments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      portal_products: {
        Row: {
          active: boolean | null
          allowed_roles: string[] | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          active?: boolean | null
          allowed_roles?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          active?: boolean | null
          allowed_roles?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      portal_profiles: {
        Row: {
          appearance_prefs: Json | null
          avatar_url: string | null
          client_id: string | null
          created_at: string
          email: string | null
          id: string
          job_title: string[] | null
          name: string
          notification_prefs: Json | null
          role: Database["public"]["Enums"]["portal_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          appearance_prefs?: Json | null
          avatar_url?: string | null
          client_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          job_title?: string[] | null
          name: string
          notification_prefs?: Json | null
          role?: Database["public"]["Enums"]["portal_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          appearance_prefs?: Json | null
          avatar_url?: string | null
          client_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          job_title?: string[] | null
          name?: string
          notification_prefs?: Json | null
          role?: Database["public"]["Enums"]["portal_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_project_milestones: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          order_index: number
          project_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          order_index?: number
          project_id: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          order_index?: number
          project_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portal_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_project_template_milestones: {
        Row: {
          created_at: string | null
          default_order: number
          description: string | null
          id: string
          relative_due_days: number | null
          template_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          default_order: number
          description?: string | null
          id?: string
          relative_due_days?: number | null
          template_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          default_order?: number
          description?: string | null
          id?: string
          relative_due_days?: number | null
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_project_template_milestones_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "portal_project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_project_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      portal_projects: {
        Row: {
          client_id: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          okr_goal: string | null
          owner_id: string | null
          progress: number | null
          start_date: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          okr_goal?: string | null
          owner_id?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          okr_goal?: string | null
          owner_id?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "portal_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      portal_social_posts: {
        Row: {
          client_id: string | null
          comments: number | null
          content: string | null
          created_at: string | null
          engagement_rate: number | null
          id: string
          impressions: number | null
          likes: number | null
          media_urls: string[] | null
          platform: string | null
          published_date: string | null
          scheduled_date: string | null
          shares: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          comments?: number | null
          content?: string | null
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          likes?: number | null
          media_urls?: string[] | null
          platform?: string | null
          published_date?: string | null
          scheduled_date?: string | null
          shares?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          comments?: number | null
          content?: string | null
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          likes?: number | null
          media_urls?: string[] | null
          platform?: string | null
          published_date?: string | null
          scheduled_date?: string | null
          shares?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_social_posts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_stakeholders: {
        Row: {
          client_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          role: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_stakeholders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_system_settings: {
        Row: {
          description: string | null
          key: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          value?: Json
        }
        Relationships: []
      }
      portal_task_assignees: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_task_assignees_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "portal_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "portal_task_assignees_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "portal_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_task_assignees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "portal_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      portal_task_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_internal: boolean
          task_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_internal?: boolean
          task_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_internal?: boolean
          task_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "portal_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_task_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "portal_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      portal_task_dependencies: {
        Row: {
          depends_on_task_id: string
          task_id: string
        }
        Insert: {
          depends_on_task_id: string
          task_id: string
        }
        Update: {
          depends_on_task_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "portal_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "portal_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_tasks: {
        Row: {
          client_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          is_visible_to_client: boolean | null
          milestone_id: string | null
          priority: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["portal_task_status"] | null
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_visible_to_client?: boolean | null
          milestone_id?: string | null
          priority?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["portal_task_status"] | null
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_visible_to_client?: boolean | null
          milestone_id?: string | null
          priority?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["portal_task_status"] | null
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_tasks_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "portal_project_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portal_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_ticket_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          message_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          message_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          message_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_ticket_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "portal_ticket_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_ticket_messages: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          id: string
          is_internal: boolean | null
          read_at: string | null
          ticket_id: string
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          read_at?: string | null
          ticket_id: string
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          read_at?: string | null
          ticket_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_messages_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "portal_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "portal_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "portal_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_tickets: {
        Row: {
          author_id: string | null
          category: Database["public"]["Enums"]["portal_ticket_category"]
          client_id: string | null
          created_at: string
          description: string | null
          id: string
          last_message_at: string | null
          priority: Database["public"]["Enums"]["portal_ticket_priority"]
          status: Database["public"]["Enums"]["portal_ticket_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: Database["public"]["Enums"]["portal_ticket_category"]
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_message_at?: string | null
          priority?: Database["public"]["Enums"]["portal_ticket_priority"]
          status?: Database["public"]["Enums"]["portal_ticket_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: Database["public"]["Enums"]["portal_ticket_category"]
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          last_message_at?: string | null
          priority?: Database["public"]["Enums"]["portal_ticket_priority"]
          status?: Database["public"]["Enums"]["portal_ticket_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "portal_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      precifik_users: {
        Row: {
          created_at: string
          id: string
          is_admin_granted_premium: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_admin_granted_premium?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_admin_granted_premium?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          background_type: string | null
          background_value: string | null
          bio: string | null
          created_at: string | null
          custom_domain: string | null
          display_name: string
          font_family: string | null
          gtm_body: string | null
          gtm_head: string | null
          id: string
          is_active: boolean | null
          is_admin_granted_premium: boolean
          link_style: string | null
          pixel_code: string | null
          text_color: string | null
          tracking_code: string | null
          updated_at: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          background_type?: string | null
          background_value?: string | null
          bio?: string | null
          created_at?: string | null
          custom_domain?: string | null
          display_name?: string
          font_family?: string | null
          gtm_body?: string | null
          gtm_head?: string | null
          id?: string
          is_active?: boolean | null
          is_admin_granted_premium?: boolean
          link_style?: string | null
          pixel_code?: string | null
          text_color?: string | null
          tracking_code?: string | null
          updated_at?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          background_type?: string | null
          background_value?: string | null
          bio?: string | null
          created_at?: string | null
          custom_domain?: string | null
          display_name?: string
          font_family?: string | null
          gtm_body?: string | null
          gtm_head?: string | null
          id?: string
          is_active?: boolean | null
          is_admin_granted_premium?: boolean
          link_style?: string | null
          pixel_code?: string | null
          text_color?: string | null
          tracking_code?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      short_links: {
        Row: {
          created_at: string | null
          id: string
          short_code: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          short_code: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          short_code?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          customer_id: string
          deleted_at: string | null
          id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_orders: {
        Row: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at: string | null
          currency: string
          customer_id: string
          deleted_at: string | null
          id: number
          payment_intent_id: string
          payment_status: string
          status: Database["public"]["Enums"]["stripe_order_status"]
          updated_at: string | null
        }
        Insert: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at?: string | null
          currency: string
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_intent_id: string
          payment_status: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Update: {
          amount_subtotal?: number
          amount_total?: number
          checkout_session_id?: string
          created_at?: string | null
          currency?: string
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_intent_id?: string
          payment_status?: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string
          deleted_at: string | null
          id: number
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status?: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      themes: {
        Row: {
          background_type: string | null
          background_value: string | null
          created_at: string | null
          description: string | null
          font_family: string | null
          id: string
          is_premium: boolean | null
          link_style: string | null
          name: string
          preview_url: string | null
          text_color: string | null
        }
        Insert: {
          background_type?: string | null
          background_value?: string | null
          created_at?: string | null
          description?: string | null
          font_family?: string | null
          id?: string
          is_premium?: boolean | null
          link_style?: string | null
          name: string
          preview_url?: string | null
          text_color?: string | null
        }
        Update: {
          background_type?: string | null
          background_value?: string | null
          created_at?: string | null
          description?: string | null
          font_family?: string | null
          id?: string
          is_premium?: boolean | null
          link_style?: string | null
          name?: string
          preview_url?: string | null
          text_color?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category_id: string
          created_at: string | null
          date: string
          description: string
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category_id: string
          created_at?: string | null
          date?: string
          description: string
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_themes: {
        Row: {
          background_type: string | null
          background_value: string | null
          created_at: string | null
          custom_css: string | null
          font_family: string | null
          id: string
          link_style: string | null
          text_color: string | null
          theme_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          background_type?: string | null
          background_value?: string | null
          created_at?: string | null
          custom_css?: string | null
          font_family?: string | null
          id?: string
          link_style?: string | null
          text_color?: string | null
          theme_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          background_type?: string | null
          background_value?: string | null
          created_at?: string | null
          custom_css?: string | null
          font_family?: string | null
          id?: string
          link_style?: string | null
          text_color?: string | null
          theme_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      stripe_user_orders: {
        Row: {
          amount_subtotal: number | null
          amount_total: number | null
          checkout_session_id: string | null
          currency: string | null
          customer_id: string | null
          order_date: string | null
          order_id: number | null
          order_status:
            | Database["public"]["Enums"]["stripe_order_status"]
            | null
          payment_intent_id: string | null
          payment_status: string | null
        }
        Relationships: []
      }
      stripe_user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string | null
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          subscription_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["stripe_subscription_status"]
            | null
        }
        Relationships: []
      }
    }
    Functions: {
      app_user_role: { Args: never; Returns: string }
      calculate_client_pace: { Args: { p_client_id: string }; Returns: string }
      cleanup_deleted_tasks: { Args: never; Returns: undefined }
      delete_client: { Args: { p_client_id: string }; Returns: undefined }
      delete_client_safely: {
        Args: { p_client_id: string; p_deleted_by: string; p_reason?: string }
        Returns: Json
      }
      delete_old_storage_files: { Args: never; Returns: undefined }
      get_client_for_nps: { Args: { token_input: string }; Returns: Json }
      get_my_organization_id: { Args: never; Returns: string }
      get_portal_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["portal_role"]
      }
      get_user_org_id: { Args: never; Returns: string }
      get_user_organization_id: { Args: { _auth_id: string }; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_link_clicks: {
        Args: { link_id: string; user_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      maintenance_anamnesis_history: { Args: never; Returns: undefined }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      portal_get_client_id: { Args: { user_uid: string }; Returns: string }
      portal_has_role: {
        Args: {
          _role: Database["public"]["Enums"]["portal_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_can_access_task: {
        Args: { task_row: Database["public"]["Tables"]["portal_tasks"]["Row"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "user"
        | "professional"
        | "consultant"
        | "analyst"
      appointment_status: "scheduled" | "completed" | "cancelled" | "no_show"
      interaction_type: "whatsapp" | "call" | "note" | "status_change"
      lead_status:
        | "new"
        | "contacted"
        | "scheduled"
        | "lost"
        | "attended"
        | "sold"
      portal_asset_status: "pending" | "approved" | "revision_requested"
      portal_asset_type: "image" | "video" | "copy"
      portal_brand_asset_category: "identity" | "strategy" | "quick_access"
      portal_brand_asset_type: "file" | "link"
      portal_client_status: "active" | "paused" | "churned"
      portal_invoice_status: "pending" | "paid" | "overdue" | "cancelled"
      portal_plan_tier: "gold" | "black" | "platinum"
      portal_project_status:
        | "onboarding"
        | "setup"
        | "active"
        | "risk"
        | "paused"
        | "completed"
        | "churn"
      portal_role:
        | "admin"
        | "consultant"
        | "user"
        | "analyst"
        | "super_admin"
        | "client"
      portal_role_new: "admin" | "analyst" | "user" | "super_admin"
      portal_task_status:
        | "backlog"
        | "todo"
        | "in_progress"
        | "waiting_approval"
        | "review"
        | "done"
      portal_ticket_category: "bug" | "question" | "finance" | "other"
      portal_ticket_priority: "low" | "normal" | "high" | "urgent"
      portal_ticket_status: "open" | "in_progress" | "resolved" | "closed"
      source_type: "ads" | "organic" | "indication" | "other"
      stripe_order_status: "pending" | "completed" | "canceled"
      stripe_subscription_status:
        | "not_started"
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
      task_priority: "low" | "medium" | "high"
      task_status: "pending" | "completed"
      task_type: "manual" | "auto_return" | "system"
      temperature: "cold" | "warm" | "hot"
      user_role: "super_admin" | "admin" | "user" | "professional"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "user",
        "professional",
        "consultant",
        "analyst",
      ],
      appointment_status: ["scheduled", "completed", "cancelled", "no_show"],
      interaction_type: ["whatsapp", "call", "note", "status_change"],
      lead_status: [
        "new",
        "contacted",
        "scheduled",
        "lost",
        "attended",
        "sold",
      ],
      portal_asset_status: ["pending", "approved", "revision_requested"],
      portal_asset_type: ["image", "video", "copy"],
      portal_brand_asset_category: ["identity", "strategy", "quick_access"],
      portal_brand_asset_type: ["file", "link"],
      portal_client_status: ["active", "paused", "churned"],
      portal_invoice_status: ["pending", "paid", "overdue", "cancelled"],
      portal_plan_tier: ["gold", "black", "platinum"],
      portal_project_status: [
        "onboarding",
        "setup",
        "active",
        "risk",
        "paused",
        "completed",
        "churn",
      ],
      portal_role: [
        "admin",
        "consultant",
        "user",
        "analyst",
        "super_admin",
        "client",
      ],
      portal_role_new: ["admin", "analyst", "user", "super_admin"],
      portal_task_status: [
        "backlog",
        "todo",
        "in_progress",
        "waiting_approval",
        "review",
        "done",
      ],
      portal_ticket_category: ["bug", "question", "finance", "other"],
      portal_ticket_priority: ["low", "normal", "high", "urgent"],
      portal_ticket_status: ["open", "in_progress", "resolved", "closed"],
      source_type: ["ads", "organic", "indication", "other"],
      stripe_order_status: ["pending", "completed", "canceled"],
      stripe_subscription_status: [
        "not_started",
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "paused",
      ],
      task_priority: ["low", "medium", "high"],
      task_status: ["pending", "completed"],
      task_type: ["manual", "auto_return", "system"],
      temperature: ["cold", "warm", "hot"],
      user_role: ["super_admin", "admin", "user", "professional"],
    },
  },
} as const

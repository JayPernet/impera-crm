import { getTeamMembers } from "./actions";
import { AddMemberButton } from "./components/add-member-button";
import { TeamMemberCard } from "./components/team-member-card";
import { Users } from "lucide-react";

export default async function TeamPage() {
    const result = await getTeamMembers();
    const { success, data: members, message } = result;

    if (!success) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <p className="text-danger text-sm">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">Equipe</h1>
                    <p className="text-text-secondary mt-1">Gerencie os corretores da sua imobiliária.</p>
                </div>
                <AddMemberButton />
            </div>

            {/* Team Members List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <Users className="h-12 w-12 text-text-tertiary mb-4" />
                        <p className="text-text-secondary">Nenhum membro na equipe ainda.</p>
                        <p className="text-text-tertiary text-sm mt-1">Adicione corretores para começar.</p>
                    </div>
                ) : (
                    members.map((member) => (
                        <TeamMemberCard
                            key={member.id}
                            member={member}
                            isCurrentUser={member.id === (result as any).currentUserId}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

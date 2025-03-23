import ProjectCard from "@/components/project-card";
import SidebarLayout from "@/components/sidebar-layout";

import { latestProjects } from "@/lib/subgraph";

export default async function DiscoverPage() {
    const projects = await latestProjects();
    
    return (
        <SidebarLayout>
            <div
                className="w-full max-w-[32rem] mt-18 mb-8 space-y-8"
            >
                {projects?.map((project, index) => 
                    <ProjectCard 
                        key={index}
                        project={project} 
                        className="w-full"
                    />
                )}
            </div>
        </SidebarLayout>
    )
}
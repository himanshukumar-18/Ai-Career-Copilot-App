import React from "react";
import ProjectCard from "./ProjectCard";

export const ProjectGrid = ({
    projects = [],
    onViewDetails,
    onUpdateStatus,
    onDelete,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    onViewDetails={onViewDetails}
                    onUpdateStatus={onUpdateStatus}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default ProjectGrid;

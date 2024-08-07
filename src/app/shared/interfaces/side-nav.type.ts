export interface SideNavInterface {
    path: string;
    title: string;
    // iconType: "" | "nzIcon" | "fontawesome" | "material";
    // iconTheme: "" | "fab" | "far" | "fas" | "fill" | "outline" | "twotone";
    icon: string,
    submenu : SideNavInterface[];
    opened?: boolean;
    addButton?: boolean;
}

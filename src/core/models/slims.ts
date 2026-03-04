export interface SlimsVisitorItem {
    member_name: string;
    institution: string;
    image: string;
  }
  
  export interface SlimsVisitorStats {
    total_visitor: string;
    total_pengunjung: string;
    visitor: SlimsVisitorItem[];
  }
  export interface SlimsTodayVisitor {
  total_visitor: string;
  total_pengunjung: string;
  visitor: {
    member_name: string;
    institution: string;
    image: string;
  }[];
}
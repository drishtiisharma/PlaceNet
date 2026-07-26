import Navbar from "@/components/common/navbar";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="pt-4">
                {children}
            </main>
        </>
    );
}

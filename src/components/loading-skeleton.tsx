import { useEffect, useState, type ReactNode } from "react";

interface SkeletonProps {
  height?: string;
  width?: string;
  borderRadius?: string;
  className?: string;
}

export const Skeleton = ({
  height = "1rem",
  width = "100%",
  borderRadius = "0.5rem",
  className = "",
}: SkeletonProps) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        height,
        width,
        borderRadius,
      }}
    />
  );
};

export const PageSkeleton = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageSkeletonContent />;
  }

  return <>{children}</>;
};

export const PageSkeletonContent = () => {
  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  switch (currentPath) {
    case "/projects":
      return <ProjectsPageSkeleton />;
    case "/resume":
      return <ResumePageSkeleton />;
    case "/contact":
      return <ContactPageSkeleton />;
    case "/testimonials":
      return <TestimonialsPageSkeleton />;
    default:
      return <HomePageSkeleton />;
  }
};

export const HomePageSkeleton = () => {
  return (
    <div className="gradient-bg min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 lg:col-span-4 w-full max-w-sm mx-auto md:max-w-none">
            <div className="glass-card p-6 rounded-3xl">
              <Skeleton
                height="300px"
                width="100%"
                className="rounded-3xl mb-6"
              />

              <div className="flex space-x-2 mb-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    height="40px"
                    width="40px"
                    borderRadius="9999px"
                  />
                ))}
              </div>

              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 mb-4">
                  <Skeleton height="24px" width="24px" borderRadius="9999px" />
                  <Skeleton height="20px" width="80%" />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-8">
            <Skeleton height="1.5rem" width="150px" className="mb-4" />
            <Skeleton height="3rem" width="80%" className="mb-4" />
            <Skeleton height="2rem" width="60%" className="mb-8" />

            <div className="h-px w-full bg-gradient-to-r from-primary/50 to-transparent my-8" />

            <Skeleton height="1rem" width="100%" className="mb-2" />
            <Skeleton height="1rem" width="95%" className="mb-2" />
            <Skeleton height="1rem" width="90%" className="mb-2" />
            <Skeleton height="1rem" width="98%" className="mb-2" />
            <Skeleton height="1rem" width="70%" className="mb-8" />

            <div className="flex gap-4">
              <Skeleton height="50px" width="150px" borderRadius="9999px" />
              <Skeleton height="50px" width="150px" borderRadius="9999px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectsPageSkeleton = () => {
  return (
    <div className="gradient-bg min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <Skeleton height="3rem" width="300px" className="mb-4" />
        <Skeleton height="1.5rem" width="500px" className="mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-black/50 p-6 rounded-xl">
              <Skeleton height="200px" className="mb-4" />
              <Skeleton height="1.5rem" width="80%" className="mb-2" />
              <Skeleton height="1rem" className="mb-4" />
              <div className="flex flex-wrap gap-2 mb-4">
                {[...Array(3)].map((_, j) => (
                  <Skeleton
                    key={j}
                    height="1.5rem"
                    width="60px"
                    borderRadius="9999px"
                  />
                ))}
              </div>
              <div className="flex justify-between">
                <Skeleton height="2rem" width="45%" />
                <Skeleton height="2rem" width="45%" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ResumePageSkeleton = () => {
  return (
    <div className="gradient-bg min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          <div>
            <Skeleton height="3rem" width="250px" className="mb-4" />
            <div className="h-1 w-20 bg-primary mb-4"></div>
            <Skeleton height="1.5rem" width="300px" />
          </div>
          <Skeleton height="50px" width="180px" className="mt-4 md:mt-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-8 mb-8">
              <div className="flex items-center mb-8">
                <Skeleton height="40px" width="40px" className="mr-3" />
                <Skeleton height="1.5rem" width="100px" />
              </div>

              {[...Array(8)].map((_, i) => (
                <div key={i} className="mb-6">
                  <div className="flex justify-between mb-2">
                    <Skeleton height="1rem" width="150px" />
                    <Skeleton height="1rem" width="40px" />
                  </div>
                  <Skeleton height="0.75rem" />
                </div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-8">
              <div className="flex items-center mb-8">
                <Skeleton height="40px" width="40px" className="mr-3" />
                <Skeleton height="1.5rem" width="120px" />
              </div>

              {[...Array(4)].map((_, i) => (
                <div key={i} className="mb-6">
                  <div className="flex justify-between mb-2">
                    <Skeleton height="1rem" width="100px" />
                    <Skeleton height="1rem" width="80px" />
                  </div>
                  <Skeleton height="0.75rem" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl p-8 mb-8">
              <div className="flex items-center mb-8">
                <Skeleton height="40px" width="40px" className="mr-3" />
                <Skeleton height="1.5rem" width="120px" />
              </div>

              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative pl-8 pb-8">
                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary to-primary/20"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>

                  <Skeleton height="1.5rem" width="80%" className="mb-2" />
                  <Skeleton height="1.2rem" width="60%" className="mb-2" />
                  <div className="flex flex-wrap justify-between">
                    <Skeleton height="1rem" width="120px" />
                    <Skeleton height="1rem" width="120px" />
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-8 mb-8">
              <div className="flex items-center mb-8">
                <Skeleton height="40px" width="40px" className="mr-3" />
                <Skeleton height="1.5rem" width="120px" />
              </div>

              {[...Array(2)].map((_, i) => (
                <div key={i} className="relative pl-8 pb-8">
                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary to-primary/20"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>

                  <Skeleton height="1.5rem" width="70%" className="mb-2" />
                  <Skeleton height="1.2rem" width="50%" className="mb-2" />
                  <Skeleton height="1rem" width="120px" className="mb-3" />
                  <Skeleton height="1rem" width="90%" />
                </div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-8">
              <div className="flex items-center mb-8">
                <Skeleton height="40px" width="40px" className="mr-3" />
                <Skeleton height="1.5rem" width="150px" />
              </div>

              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-start mb-4 p-4 bg-black/30 rounded-lg"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full mr-3"></div>
                  </div>
                  <Skeleton height="1rem" width="90%" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPageSkeleton = () => {
  return (
    <div className="gradient-bg min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <Skeleton height="3rem" width="300px" className="mb-4" />
        <div className="h-1 w-20 bg-primary mb-4"></div>
        <Skeleton height="1.5rem" width="500px" className="mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-black/50 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <Skeleton height="50px" width="50px" borderRadius="9999px" />
                  <div className="flex-1">
                    <Skeleton height="1.5rem" width="100px" className="mb-2" />
                    <Skeleton height="1rem" width="80%" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-8">
              <Skeleton height="2rem" width="250px" className="mb-6" />

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton height="1rem" width="100px" className="mb-2" />
                    <Skeleton height="40px" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton height="1rem" width="100px" className="mb-2" />
                    <Skeleton height="40px" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton height="1rem" width="100px" className="mb-2" />
                  <Skeleton height="40px" />
                </div>

                <div className="space-y-2">
                  <Skeleton height="1rem" width="100px" className="mb-2" />
                  <Skeleton height="150px" />
                </div>

                <Skeleton height="50px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TestimonialsPageSkeleton = () => {
  return (
    <div className="gradient-bg min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <Skeleton height="3rem" width="400px" className="mb-4" />
        <div className="h-1 w-20 bg-primary mb-4"></div>
        <Skeleton height="1.5rem" width="500px" className="mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-black/50 backdrop-blur-sm rounded-xl p-6 h-full"
            >
              <Skeleton height="40px" width="40px" className="mb-4" />
              <Skeleton height="1rem" width="100%" className="mb-2" />
              <Skeleton height="1rem" width="95%" className="mb-2" />
              <Skeleton height="1rem" width="90%" className="mb-2" />
              <Skeleton height="1rem" width="85%" className="mb-6" />

              <div className="flex mb-6">
                {[...Array(5)].map((_, j) => (
                  <Skeleton
                    key={j}
                    height="16px"
                    width="16px"
                    className="mr-1"
                  />
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Skeleton height="56px" width="56px" borderRadius="9999px" />
                <div>
                  <Skeleton height="1.2rem" width="120px" className="mb-2" />
                  <Skeleton height="1rem" width="150px" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { Info } from "lucide-react";

export const DataFileGuide = () => {
  return (
    <div className="glass-card rounded-xl p-6 mt-6">
      <div className="flex items-start gap-4">
        <div className="bg-blue-500/20 p-3 rounded-full">
          <Info className="text-blue-400" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">
            TypeScript Data File Guide
          </h3>
          <p className="text-gray-300 mb-4">
            This portfolio application stores data directly in TypeScript files.
            To manage your data without using a database or external service,
            follow the steps below:
          </p>

          <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li>
              <strong>Add/Delete Data:</strong> You can add or delete projects
              or references from the admin panel. This data is temporarily
              stored in your browser's LocalStorage.
            </li>
            <li>
              <strong>Updating Data Files:</strong> When you add or delete new
              data, you can view the updated TypeScript code by clicking the
              'Generate TypeScript Code' button.
            </li>
            <li>
              <strong>Copying the Code:</strong> Copy the generated code{" "}
              <code className="bg-black/30 px-2 py-1 rounded">
                src/data/projectdata.ts
              </code>{" "}
              and{" "}
              <code className="bg-black/30 px-2 py-1 rounded">
                src/data/testimonialdata.ts
              </code>{" "}
              paste it into your project's files.
            </li>
            <li>
              <strong>Rebuilding the Project:</strong> To apply the changes,
              rebuild and deploy your project.
            </li>
          </ol>

          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-300 text-sm">
              <strong>Note:</strong> This approach is suitable for small to
              medium-sized portfolio websites. Since your data is stored
              directly in the source code, you need to update the code and
              rebuild it for each change. However, it is simple and easy to use,
              as it does not require a database or external service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

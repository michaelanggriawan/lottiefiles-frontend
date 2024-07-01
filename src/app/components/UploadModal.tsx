import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { XIcon } from "@heroicons/react/solid";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (author: string, title: string, file: File) => void;
  loading: boolean;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, loading }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      author: '',
      title: '',
      file: null,
    }
  });

  const onSubmit = (data: any) => {
    if (data.file && data.file[0]) {
      onUpload(data.author, data.title, data.file[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 relative max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-gray-300 rounded-full hover:bg-gray-400"
        >
          <XIcon className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Upload JSON Lottie</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Author</label>
            <Controller
              name="author"
              control={control}
              rules={{ required: "Author is required" }}
              render={({ field }) => (
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg text-black"
                  {...field}
                  value={field.value || ''}
                />
              )}
            />
            {errors.author && (
              <p className="text-red-600">{errors.author.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg text-black"
                  {...field}
                  value={field.value || ''}
                />
              )}
            />
            {errors.title && (
              <p className="text-red-600">{errors.title.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">JSON File</label>
            <Controller
              name="file"
              control={control}
              rules={{ required: "File is required" }}
              render={({ field }) => (
                <input
                  type="file"
                  accept="application/json"
                  className="text-black"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              )}
            />
            {errors.file && (
              <p className="text-red-600">{errors.file.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;

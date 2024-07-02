"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ANIMATIONS_QUERY, UPLOAD_ANIMATION_MUTATION } from "./graphql/queries/animation";
import Card from "@/app/components/Card";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/Pagination";
import Modal from "@/app/components/Modal";
import UploadModal from "@/app/components/UploadModal";
import Alert from "@/app/components/Alert";
import { PlusCircleIcon } from "@heroicons/react/solid";
import Spinner from "@/app/components/Spinner";
import NotFound from "@/app/components/NotFound";

type Animation = {
  id: string;
  author: string;
  title: string;
  source: string;
}

const ANIMATIONS_PER_PAGE = 4;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedAnimation, setSelectedAnimation] = useState<Animation | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { data, loading, error, refetch } = useQuery<{ getAnimations: Animation[] }>(ANIMATIONS_QUERY, {
    variables: {
      searchTerm: '',
    },
  });

  const [uploadAnimation, { loading: isLoadingUpload }] = useMutation(UPLOAD_ANIMATION_MUTATION);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(0);
    refetch({ searchTerm });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCardClick = (animation: Animation) => {
    setSelectedAnimation(animation);
  };

  const handleCloseModal = () => {
    setSelectedAnimation(null);
  };

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const handleUploadClose = () => {
    setUploadModalOpen(false);
  };

  const handleFileUpload = async (author: string, title: string, file: File) => {
    if (file) {
      try {
        await uploadAnimation({
          variables: {
            addAnimationsData: {
              author,
              title,
              file,
            },
          },
        });
        setAlert({ message: "Upload successful!", type: "success" });
        refetch().then((result) => {
          const newTotalPages = Math.ceil(result.data.getAnimations.length / ANIMATIONS_PER_PAGE);
          setCurrentPage(newTotalPages - 1);
        });
      } catch (error) {
        setAlert({ message: "Upload failed!", type: "error" });
      }
    }
    handleUploadClose();
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
  if (error) return <div>Error: {error.message}</div>;

  const totalPages = data ? Math.ceil(data.getAnimations.length / ANIMATIONS_PER_PAGE) : 0;

  const renderLotties = () => {
    const animations = data && data.getAnimations;
      const start = currentPage * ANIMATIONS_PER_PAGE;
      const end = start + ANIMATIONS_PER_PAGE;
      return animations?.slice(start, end).map((animation: Animation) => {
        const data = JSON.parse(animation.source);
        return (
          <Card
            author={animation.author}
            title={animation.title}
            data={data}
            key={animation.id}
            onClick={() => handleCardClick(animation)}
          />
        );
      });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-24 bg-gray-100 relative">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="w-full flex flex-col md:flex-row justify-center items-center mb-4 relative">
        <SearchBar onSearch={handleSearch} />
        <button
          onClick={handleUploadClick}
          className="mt-4 md:mt-0 md:absolute md:top-0 md:right-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center whitespace-nowrap"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Upload JSON
        </button>
      </div>
      { data && data.getAnimations.length ? (      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
        {renderLotties()}
      </div>) : <div className="flex items-center justify-center"><NotFound /></div> }

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {selectedAnimation && (
        <Modal
          isOpen={!!selectedAnimation}
          onClose={handleCloseModal}
          animationData={JSON.parse(selectedAnimation.source)}
          title={selectedAnimation.title}
          author={selectedAnimation.author}
        />
      )}
      {uploadModalOpen && (
        <UploadModal
          isOpen={uploadModalOpen}
          onClose={handleUploadClose}
          onUpload={handleFileUpload}
          loading={isLoadingUpload}
        />
      )}
    </main>
  );
}

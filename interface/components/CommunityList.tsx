// --- React components/methods
import React, { useEffect, useState } from "react";

// --- Components
import CommunityCard from "./CommunityCard";
import ModalTemplate from "./ModalTemplate";
import NoCommunities from "./NoCommunities";

// --- Utils
import {
  createCommunity,
  getCommunities,
  Community,
} from "../utils/account-requests";
import { Input } from "@chakra-ui/react";

const CommunityList = (): JSX.Element => {
  const [modalOpen, setModalOpen] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [error, setError] = useState<undefined | string>();
  const [communities, setCommunities] = useState<Community[]>([]);

  const handleCreateCommunity = async () => {
    try {
      await createCommunity({
        name: communityName,
        description: communityDescription,
      });
      setCommunityName("");
      setCommunityDescription("");
      setCommunities(await getCommunities());
      setModalOpen(false);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    let keysFetched = false;
    const fetchCommunities = async () => {
      if (keysFetched === false) {
        try {
          await getCommunities();
          keysFetched = true;
          setCommunities(await getCommunities());
        } catch (error) {
          console.log({ error });
          setError("There was an error fetching your Communities.");
        }
      }
    };
    fetchCommunities();
  }, []);

  const communityList = communities.map((community: Community, i: number) => {
    return <CommunityCard key={i} community={community} />;
  });

  return (
    <>
      {communities.length === 0 ? (
        <NoCommunities addRequest={() => setModalOpen(true)} />
      ) : (
        <div className="mx-11 mt-10">
          <p className="mb-3 font-librefranklin font-semibold text-purple-softpurple">
            My Communities
          </p>
          {communityList}

          <button
            data-testid="open-community-modal"
            onClick={() => setModalOpen(true)}
            className="text-md mt-5 rounded-sm border border-gray-lightgray py-1 px-6 font-librefranklin text-blue-darkblue transition delay-100 duration-150 ease-in-out hover:bg-gray-200"
          >
            <span className="text-lg">+</span> Add
          </button>
          {error && <div>{error}</div>}
        </div>
      )}
      <ModalTemplate
        title="Create a Community"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="flex flex-col">
          <label className="text-gray-softgray font-librefranklin text-xs">
            Community Name
          </label>
          <Input
            data-testid="community-name-input"
            className="mb-4"
            value={communityName}
            onChange={(name) => setCommunityName(name.target.value)}
            placeholder="Community name"
          />
          <label className="text-gray-softgray font-librefranklin text-xs">
            Community Description
          </label>
          <Input
            data-testid="community-description-input"
            value={communityDescription}
            onChange={(description) =>
              setCommunityDescription(description.target.value)
            }
            placeholder="Community Description"
          />
          <div className="flex w-full justify-end">
            <button
              disabled={!communityName && !communityDescription}
              data-testid="create-button"
              className="mt-6 mb-2 rounded bg-purple-softpurple py-2 px-4 text-white disabled:opacity-25"
              onClick={handleCreateCommunity}
            >
              Create
            </button>
            {error && <div>{error}</div>}
          </div>
        </div>
      </ModalTemplate>
    </>
  );
};

export default CommunityList;

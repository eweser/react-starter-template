import type { Profile, Room, Documents, DocumentBase } from '@eweser/db';
import { CollectionKey } from '@eweser/db';
import { useState, useCallback, useEffect } from 'react';
import { makeCollectionProvider, useCollection } from './CollectionContext';
import { useDatabase } from './DatabaseContext';
import { thisAppProfileKey } from './config';
const { Provider, context } = makeCollectionProvider();

export const ProfilesProvider = ({
  aliasSeed,
  children,
}: {
  aliasSeed?: string;
  children: React.ReactNode;
}) => (
  <Provider collectionKey={CollectionKey.profiles} aliasSeed={aliasSeed}>
    {children}
  </Provider>
);

export type AppSettings = {
  alias?: string;
} & DocumentBase;

export const defaultProfileId = 'default';

export const useProfilesCollections = () => useCollection<Profile>(context);

export const useProfilesDocuments = (room: Room<Profile>) => {
  const { db } = useDatabase();
  const Profiles = room ? db.getDocuments(room) : undefined;
  const [profiles, setProfiles] = useState<Documents<Profile> | undefined>();

  // usually we try not to call `useDocuments` without a room, but in this case
  // we can't be sure that the room will be available when the component mounts
  if (Profiles && !profiles) {
    const unDeleted = Profiles.sortByRecent(Profiles.getUndeleted());
    setProfiles(unDeleted);
  }

  Profiles?.onChange((_event) => {
    const unDeleted = Profiles.sortByRecent(Profiles.getUndeleted());
    setProfiles(unDeleted);
  });

  const createProfile = useCallback(
    (profile: Partial<Profile>) => {
      return Profiles?.new({ ...profile });
    },
    [Profiles]
  );

  const deleteProfile = useCallback(
    (profile: Profile) => {
      return Profiles?.delete(profile._id);
    },
    [Profiles]
  );

  const updateProfile = useCallback(
    (profile: Partial<Profile> & { _id: string }) => {
      const existingProfile = Profiles?.get(profile._id);
      const update = { ...existingProfile, ...profile } as Profile;
      Profiles?.set(update);
    },
    [Profiles]
  );

  return {
    profiles,
    createProfile,
    deleteProfile,
    updateProfile,
  };
};
// public and private are created for each user when they sign up, and the profile will be under the 'default' key
const profileRoomsToConnect = ['public', 'private', thisAppProfileKey];

export const useProfiles = () => {
  const { connectedRooms, roomsList, handleConnectRoom, handleCreateRoom } =
    useProfilesCollections();
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    const connectAllRooms = async () => {
      if (connecting) return;
      setConnecting(true);
      if (roomsList.public && roomsList.private) {
        for (const aliasSeed of profileRoomsToConnect) {
          if (connectedRooms[aliasSeed]) return null;
          if (roomsList[aliasSeed]) {
            handleConnectRoom(aliasSeed);
          } else if (aliasSeed === thisAppProfileKey) {
            handleCreateRoom(aliasSeed, [
              {
                alias: 'Alias',
                _id: defaultProfileId,
              },
            ] as any);
          }
        }
      }
      setConnecting(false);
    };
    connectAllRooms();
  }, [
    connectedRooms,
    connecting,
    handleConnectRoom,
    handleCreateRoom,
    roomsList,
  ]);

  const { profiles: publicProfiles, updateProfile: updatePublicProfile } =
    useProfilesDocuments(connectedRooms.public);
  const { profiles: privateProfiles, updateProfile: updatePrivateProfile } =
    useProfilesDocuments(connectedRooms.private);
  const { profiles: appProfiles, updateProfile: updateAppProfile } =
    useProfilesDocuments(connectedRooms[thisAppProfileKey]);

  const publicProfile = publicProfiles?.[defaultProfileId];
  const privateProfile = privateProfiles?.[defaultProfileId];
  const appProfile = appProfiles?.[defaultProfileId] as AppSettings | undefined;

  return {
    publicProfile,
    privateProfile,
    appProfile,
    connectedRooms,
    updatePublicProfile,
    updatePrivateProfile,
    updateAppProfile: updateAppProfile as (
      profile: Partial<AppSettings> & {
        _id: string;
      }
    ) => void,
  };
};

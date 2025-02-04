import React, { useState } from 'react';
import { layoutDispatch, layoutSelectInput } from '../../layout/context';
import { ACTIONS, PANELS } from '../../layout/enums';
import Styled from '../private-notes/styles';
import Header from '/imports/ui/components/common/control-header/component';

import { startWatching } from '../../external-video-player/external-video-player-graphql/modal/component';
import { EXTERNAL_VIDEO_START } from '../../external-video-player/mutations';
import { useMutation } from '@apollo/client';

import { startPoll } from '/imports/ui/components/poll/components/StartPollButton';
import { POLL_CREATE } from '/imports/ui/components/poll/mutations';
import Session from '/imports/ui/services/storage/in-memory';

import { CHAT_SEND_MESSAGE } from '/imports/ui/components/chat/chat-graphql/chat-message-form/mutations';
import { textToMarkdown } from '/imports/ui/components/chat/chat-graphql/chat-message-form/service';

import Table from '/imports/ui/components/table/component';

interface ExternalVideoResource {
  resource_type: 1;
  external_video_link: string;
}

interface PollResource {
  resource_type: 2;
  is_anonymous: boolean;
  question: string;
  is_multiple_response: boolean;
  answers: string[];
}

interface FreeTextResource {
  resource_type: 3;
  text: string;
}

type Resource = ExternalVideoResource | PollResource | FreeTextResource;

interface ResourceJSON {
  resources: Resource[];
}

const PrivateNotes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resourceJSON, setResourceJSON] = useState<ResourceJSON>();

  // ++++ POLL ++++ // 
  const [createPoll] = useMutation(POLL_CREATE);
  //@ts-ignore
  const CHAT_CONFIG = window.meetingClientSettings.public.chat;
  const PUBLIC_CHAT_KEY = CHAT_CONFIG.public_id;

  // ++++ VIDEO ++++ // 
  const [startExternalVideo] = useMutation(EXTERNAL_VIDEO_START);

  // ++++ CHAT ++++ // 
  const [chatSendMessage] = useMutation(CHAT_SEND_MESSAGE);
  const PUBLIC_CHAT_ID = CHAT_CONFIG.public_id;

  const dispatch = layoutDispatch();

  // Sidebar open/close state
  const isOpen = layoutSelectInput((input: any) => {
    return input.sidebarContent?.sidebarContentPanel === 'private-notes';
  });

  // Handle JSON file upload
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (e) => {
      if (!e.target?.result) return;
      const resourceJSONTemp: ResourceJSON = JSON.parse(
        e.target.result as string
      ) as ResourceJSON;
      setResourceJSON(resourceJSONTemp);
    };
  };

  // Close the panel
  const handleClose = () => {
    dispatch({
      type: ACTIONS.SET_PRIVATE_NOTES_WINDOW_OPEN,
      value: false,
    });
  };

  // 1) Transform resource data into objects with these columns:
  //    - "resourceId" for R-Id
  //    - "title" for Title
  //    - "action" for a React element (the button)
  const resourceTableData = resourceJSON?.resources?.map((resource, index) => {
    const resourceId = `R-${resource.resource_type}`; // e.g. R-1, R-2, R-3
    let title: string;
    let action: JSX.Element;

    switch (resource.resource_type) {
      case 1:
        title = resource.external_video_link;
        action = (
          <button
            onClick={() =>
              startWatching(resource.external_video_link, startExternalVideo)
            }
          >
            Play Video
          </button>
        );
        break;

      case 2:
        title = resource.question;
        action = (
          <button
            onClick={() => {
              startPoll(
                'CUSTOM',
                resource.is_anonymous,
                resource.question,
                resource.is_multiple_response,
                createPoll,
                true,
                PUBLIC_CHAT_KEY,
                resource.answers
              );
              dispatch({
                type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
                value: true,
              });
              dispatch({
                type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
                value: PANELS.POLL,
              });
              Session.setItem('forcePollOpen', true);
              Session.setItem('pollInitiated', true);
            }}
          >
            Start Poll
          </button>
        );
        break;

      case 3:
        title = resource.text;
        action = (
          <button
            onClick={() => {
              chatSendMessage({
                variables: {
                  chatMessageInMarkdownFormat: textToMarkdown(resource.text),
                  chatId: PUBLIC_CHAT_ID,
                },
              });
            }}
          >
            Send Chat
          </button>
        );
        break;

      default:
        // Unknown resource type
        title = 'Unknown';
        action = <span>None</span>;
        break;
    }

    return {
      resourceId,
      title,
      action,
      // If your "Table" needs a unique key from each row, you could add "id: index" here
      // but "Table" may already use something else for the unique row key.
    };
  }) || [];

  if (!isOpen) return null;

  return (
    <Styled.PrivateNotesWindow>
      {/* @ts-ignore */}
      <Header
        leftButtonProps={{
          onClick: () => {
            handleClose();
            dispatch({
              type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
              value: false,
            });
            dispatch({
              type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
              value: PANELS.NONE,
            });
          },
          'data-test': 'hideNotesLabel',
          'aria-label': 'intl.formatMessage(intlMessages.hide)',
          label: 'Ressourcen',
        }}
      />

      <input type="file" onChange={handleChange} />

      {/* 2) The table now shows R-Id / Title / Action */}
      <Table
        headers={[
          { column: 'resourceId', label: 'R-Id' },
          { column: 'title', label: 'Title' },
          { column: 'action', label: 'Action' },
        ]}
        data={resourceTableData}
        isLoading={isLoading}
        loadingTag={<h1>Loading...</h1>}
      />
    </Styled.PrivateNotesWindow>
  );
};

export default PrivateNotes;

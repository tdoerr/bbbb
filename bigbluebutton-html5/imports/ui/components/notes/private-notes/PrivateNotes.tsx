import React, { useState, useEffect } from 'react';
import Styled from './styles';
import Header from '/imports/ui/components/common/control-header/component';
import { layoutDispatch, layoutSelectInput } from '../../layout/context';
import { ACTIONS, PANELS } from '../../layout/enums';

const STORAGE_KEY = 'private_notes';

const PrivateNotes: React.FC = () => {
  const [notes, setNotes] = useState<string>('');
  const dispatch = layoutDispatch();
  const isOpen = layoutSelectInput((input: any) => {
    return input.sidebarContent?.sidebarContentPanel === 'private-notes';
  });

  useEffect(() => {
    const savedNotes = sessionStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setNotes(value);
    sessionStorage.setItem(STORAGE_KEY, value);
  };
  const handleClose = () => {
    dispatch({
      type: ACTIONS.SET_PRIVATE_NOTES_WINDOW_OPEN,
      value: false,
    });
  };

  return (
    <Styled.Container>
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
          label: 'Private Notes',
        }}
      />
      <Styled.TextArea
        value={notes}
        onChange={handleChange}
        placeholder="Write your private notes here."
      />
    </Styled.Container>
  );
};

export default PrivateNotes;

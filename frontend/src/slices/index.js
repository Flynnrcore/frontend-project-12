import { configureStore } from '@reduxjs/toolkit';
import channelsReducer, { actions as channelsActions } from './channelsSlice.jsx';
import messagesReducer, { actions as messagesActions } from './messagesSlice.jsx';
import modalReducer, { actions as modalActions } from './modalSlice.jsx';

const actions = {
  ...channelsActions,
  ...messagesActions,
  ...modalActions,
};

export { actions };
export default configureStore({
  reducer: {
    chatChannels: channelsReducer,
    chatMessages: messagesReducer,
    modal: modalReducer,
  },
});

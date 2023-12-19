import { useEffect, useRef } from 'react';
import { Modal as ElModal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useApi } from '../../hooks/index.jsx';

const getChannelsName = ({ chatChannels: { channels } }) => channels.map(({ name }) => name);

const RenameChannelModal = ({ handleClose }) => {
  const { t } = useTranslation();
  const channelsNames = useSelector(getChannelsName);
  const channelId = useSelector(({ modal }) => modal.id);
  const channel = useSelector(({ chatChannels: { channels } }) => channels
    .find(({ id }) => id === channelId));
  const api = useApi();

  const inputRef = useRef();
  useEffect(() => {
    setTimeout(() => inputRef.current.select());
  }, []);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .min(3, 'modals.min')
      .max(20, 'modals.max')
      .notOneOf(channelsNames, 'modals.uniq')
      .required('modals.required'),
  });

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema,
    onSubmit: async ({ name }) => {
      try {
        await api.renameChannel({ name, id: channelId });
        handleClose();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <>
      <ElModal.Header closeButton>
        <ElModal.Title>{t('modals.rename')}</ElModal.Title>
      </ElModal.Header>
      <ElModal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              required
              className="mb-2"
              ref={inputRef}
              disabled={formik.isSubmitting}
              onChange={formik.handleChange}
              value={formik.values.name}
              name="name"
              id="name"
            />
            <div className="d-flex justify-content-end">
              <Button
                className="me-2"
                variant="secondary"
                type="button"
                onClick={handleClose}
              >
                {t('modals.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {t('modals.submit')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </ElModal.Body>
    </>
  );
};

export default RenameChannelModal;
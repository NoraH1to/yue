import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Box,
  Grow,
  List,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  ListItem,
  ListItemIcon,
} from '@mui/material';
import { AddRounded, DragIndicatorRounded } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

import fs from '@/modules/fs';
import { ROUTE_PATH } from '@/router';
import { moveArrayItem } from '@/helper';
import RouterLink from '../components/RouterLink';
import TagListItem from './TagListItem';
import ContextMenuTrigger from '@/components/ContextMenu/Trigger';
import TagItemContextMenu from './TagItemContextMenu';
import TagEditDialog from '../../../../components/TagItem/TagEditDialog';
import TagAddDialog from '../../../../components/TagItem/TagAddDialog';

import { FC } from 'react';
import { ListProps, GrowProps } from '@mui/material';
import { TFsTag } from '@/modules/fs/Fs';

const TagList: FC<Pick<GrowProps, 'timeout' | 'style' | 'in'> & ListProps> = ({
  timeout,
  style: animeStyle,
  in: In,
  ...props
}) => {
  const { t } = useTranslation();

  const originTagList = useLiveQuery(() => fs.getTags());
  const [tagList, setTagList] = useState<TFsTag[]>();
  useEffect(() => {
    originTagList && setTagList(originTagList);
  }, [originTagList]);

  const [openDialogAddTag, setOpenDialogAddTag] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();

  const [targetTag, setTargetTag] = useState<TFsTag>();

  const Content = (
    <List
      {...props}
      sx={[
        { display: 'flex', flexDirection: 'column' },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}>
      <ListItem sx={{ py: 1 }}>
        {/* 添加 dialog */}
        <TagAddDialog open={openDialogAddTag} onClose={() => setOpenDialogAddTag(false)} />
        <ListItemText secondary={t('tag')} />
        <ListItemSecondaryAction>
          <Tooltip title={t('action.create tag')}>
            <IconButton edge="end" onClick={() => setOpenDialogAddTag(true)}>
              <AddRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          if (!destination || !tagList || destination.index === source.index) return;
          const t = tagList[destination.index];
          const s = tagList[source.index];
          moveArrayItem(tagList, source.index, destination.index);
          setTagList([...tagList]);
          fs.moveTag(s.id, t.id, source.index < destination.index ? 'asc' : 'desc');
        }}>
        <Droppable droppableId="tags">
          {(provided) => (
            <Box
              flexGrow={1}
              height={0}
              overflow="auto"
              px={2}
              ref={provided.innerRef}
              {...provided.droppableProps}>
              {tagList?.map((tag, i) => (
                <Draggable key={tag.id} draggableId={tag.id} index={i}>
                  {({
                    draggableProps: { style, ...draggableProps },
                    dragHandleProps,
                    innerRef,
                  }) => (
                    <Grow in={In} timeout={timeout} style={animeStyle} ref={innerRef}>
                      {/* Grow 的动画会生效在最近的真实元素，需要与拽托样式隔离 ，否则会有 bug*/}
                      <Box>
                        <Box
                          {...draggableProps}
                          style={style}
                          sx={[
                            (theme) => ({
                              position: 'relative',
                              height: `${
                                theme.typography.htmlFontSize *
                                  parseFloat(
                                    (theme.typography.subtitle2.fontSize! as string).replace(
                                      'rem',
                                      '',
                                    ),
                                  ) *
                                  (theme.typography.subtitle2.lineHeight! as number) +
                                parseFloat(theme.spacing(3).replace('px', ''))
                              }px`,
                            }),
                          ]}>
                          <RouterLink
                            sx={{
                              mx: 0,
                            }}
                            to={`${ROUTE_PATH.TAG}/${tag.id}`}>
                            {({ isActive }) => (
                              <ContextMenuTrigger
                                onOpen={(position) => {
                                  setTargetTag(tag);
                                  setMenuPosition({ ...position });
                                  setOpenMenu(true);
                                }}>
                                {({ triggerProps }) => (
                                  // 实际触控到的是 div 而不是 a 标签，改善 iOS 设备的拽托体验
                                  <Box position="absolute" width={1} height={1}>
                                    <TagListItem
                                      sx={{ my: 0 }}
                                      prefix={
                                        (
                                          <ListItemIcon
                                            sx={(theme) => ({
                                              color: theme.palette.action.disabled,
                                              mr: `-${theme.spacing(2)}`,
                                            })}>
                                            <Box
                                              sx={[
                                                {
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                },
                                                (theme) => ({
                                                  position: 'absolute',
                                                  top: 0,
                                                  left: 0,
                                                  bottom: 0,
                                                  padding: theme.spacing(1),
                                                }),
                                              ]}
                                              {...draggableProps}
                                              {...dragHandleProps}>
                                              <DragIndicatorRounded />
                                            </Box>
                                          </ListItemIcon>
                                        ) as any
                                      }
                                      tag={tag}
                                      selected={isActive}
                                      {...triggerProps}
                                    />
                                  </Box>
                                )}
                              </ContextMenuTrigger>
                            )}
                          </RouterLink>
                        </Box>
                      </Box>
                    </Grow>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      {/* 右键菜单 */}
      <TagItemContextMenu
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        onDelete={async () => {
          setOpenMenu(false);
          try {
            await confirm();
            targetTag && (await fs.deleteTag(targetTag.id));
            enqueueSnackbar({
              variant: 'success',
              message: t('actionRes.delete tag success'),
            });
          } catch {
            /* empty */
          }
        }}
        onEdit={() => {
          setOpenMenu(false);
          setOpenEditDialog(true);
        }}
        {...menuPosition}
      />
      {/* 编辑 dialog */}
      <TagEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        tag={targetTag}
      />
    </List>
  );

  return Content;
};

export default TagList;

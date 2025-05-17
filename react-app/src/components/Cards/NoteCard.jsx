import React from 'react';

import {
  MdCreate,
  MdDelete,
  MdPushPin,
  MdOutlinePushPin
} from 'react-icons/md';

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote
}) => {
  return (
    <div className="border rounded-md p-4 border-slate-200 bg-white hover:shadow-lg transition-all ease-in-out duration-200 w-full max-w-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h6 className="text-base font-semibold text-gray-800">{title}</h6>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <button onClick={onPinNote} title="Pin Note">
          {isPinned ? (
            <MdPushPin className="text-xl text-blue-500 hover:text-blue-600" />
          ) : (
            <MdOutlinePushPin className="text-xl text-gray-400 hover:text-blue-400" />
          )}
        </button>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-700 mt-3 line-clamp-3">
        {content?.slice(0, 120)}{content?.length > 120 ? '...' : ''}
      </p>

      {/* Tags & Actions */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-gray-500 truncate max-w-[60%]">
          {tags.map((item) => `#${item}`)}
        </div>
        <div className="flex items-center gap-3">
          <MdCreate
            className="text-lg text-gray-600 hover:text-green-600 cursor-pointer"
            title="Edit Note"
            onClick={onEdit}
          />
          <MdDelete
            className="text-lg text-gray-600 hover:text-red-500 cursor-pointer"
            title="Delete Note"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;

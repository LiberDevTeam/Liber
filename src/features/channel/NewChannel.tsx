import { goBack, push } from 'connected-react-router';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addChannel } from '../me/meSlice';

export default function NewChannel() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit() {
    if (!name) {
      alert('name should not be empty.');
      return;
    }
    if (name.length > 30) {
      alert('the length of the name should be up to 20.')
      return;
    }
    if (!description) {
      alert('description should not be empty.');
      return;
    }
    if (description.length > 150) {
      alert('the length of the description should be up to 150.')
      return;
    }
    const id = uuidv4()
    dispatch(addChannel({ id, name, description }))
    dispatch(push(`/channels/${id}`));
  }

  return (
    <div className="my-4 mx-2">
      <h1 className="mt-8 mb-8 text-3xl font-semibold leading-6 text-gray-800">New Channel</h1>
      <div className="col-span-6 sm:col-span-4 mb-4">
        <label htmlFor="name" className="block text-md font-medium text-gray-700">Name</label>
        <input value={name} onChange={e => setName(e.target.value)} type="text" id="name" className="rounded p-2 shadow focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 border" />
      </div>
      <div className="col-span-6 sm:col-span-4 mb-6">
        <label htmlFor="description" className="block text-md font-medium text-gray-700">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} id="description" rows={3} className="rounded p-2 shadow focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 border"></textarea>
      </div>
      <button onClick={handleSubmit} className="inline-flex items-center justify-center mb-3 w-full border-2 flex-shrink-0 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-50 hover:border-gray-700 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-200 bg-gray-700">
        Open!
      </button>
      <button onClick={(e) => dispatch(goBack())} className="inline-flex items-center justify-center mb-3 w-full border-2 border-gray-400 flex-shrink-0 text-gray-500 text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-50 hover:border-gray-300 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-200">
        Cancel
      </button>
    </div>
  );
}
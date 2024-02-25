'use client';

import { UploadButton } from '@uploadthing/react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import  {useProfile}  from "../../../../../components/UserProfile";
import MenuItemForm from '../../../../../components/layout/MenuItemForm';


const EditItemPageById = () => {
  const { loading, data } = useProfile();
  const params = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [redirectToItems, setRedirectToItems] = useState(false);
  
  useEffect(()=> {
    console.log(params.id);
    fetch("../../../api/menu-items")
      .then(res => res.json())
      .then(items => {
        const item = items.find(i => i._id === params.id);
        // console.log(item);
        setMenuItem(item);

      })
  }, [params])

  async function handleItemEdit(event, data) {
    event.preventDefault()
    // console.log(image, itemName, itemDescrip, itemPrice);
    setRedirectToItems(false);
    const _id = params.id;
    data = { _id, ...data };
    const editedPromise = new Promise(async(resolve, reject)=> {
      const response = await fetch('../../../api/menu-items', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
      });

      if(response.ok) {
        resolve();
        setRedirectToItems(true);
      }
      else {
        reject();
      }

    });

    await toast.promise(editedPromise, {
       loading: 'Editing this tasty item...',
       success: 'Edited tasty item.',
       error: 'Error, something was wrong !'
    })
    
  }

  // console.log(loading);


  if (redirectToItems) {
    return redirect('/dashboard/menu-items');
  }

  if (loading) {
    return (
      <div className="text-center mt-20">
        <h2>Loading...</h2>
      </div>
    );
  }

    return (
        <section className='max-w-md ml-20 px-10 py-5 pb-10 rounded border border-gray-300'>
            <div className='flex justify-end pb-5'>
               <Link 
              href={'/dashboard/menu-items/view-items'} 
              className='bg-purple-600 p-1 text-white rounded px-2'
               >view all items</Link>
            </div>
          
          <h2 className='mb-5 text-center text-fuchsia-700 text-2xl'>Edit Item</h2>
          <MenuItemForm menuItem={menuItem} onSubmit={handleItemEdit} buttomName={'Edit Item'} />

        </section>
    );
};

export default EditItemPageById;
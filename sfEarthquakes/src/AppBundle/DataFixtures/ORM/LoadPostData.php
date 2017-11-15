<?php
/**
 * Created by PhpStorm.
 * User: maikel
 * Date: 13.11.2017
 * Time: 14:36
 */

namespace AppBundle\DataFixtures\ORM;


use AppBundle\Entity\Post;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class LoadPostData implements FixtureInterface
{

    /**
     * Load data fixtures with the passed EntityManager
     *
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 100; $i++) {
            $post = new Post();
            $post->setTitle($faker->sentence(3));
            $post->setContent($faker->text(700));
            $post->setCreatedAt($faker->dateTimeThisMonth());
            $manager->persist($post);
        }

        $manager->flush();

    }
}